"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface UseSpeechToTextJaOptions {
  lang?: string;
  pauseMs?: number;
  autoLineBreak?: boolean;
  smartNormalize?: boolean;
  onFinal?: (text: string) => void; // 確定テキストを受け取るコールバック
}

export const useSpeechToTextJa = (options: UseSpeechToTextJaOptions = {}) => {
  const {
    lang = "ja-JP",
    pauseMs = 1100,
    autoLineBreak = true,
    smartNormalize = true,
    onFinal,
  } = options;

  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shortBreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longBreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestInterimRef = useRef<string>("");
  const lastFlushedChunkRef = useRef<string>(""); // 直前に通知したチャンク（重複ガード用）
  const interimFlushedRef = useRef<string>(""); // Interimの段階で独自にFlushしたテキストの累積
  const resultCountRef = useRef<number>(0); 
  const processedResultIndexRef = useRef<number>(0); // 処理済みの結果インデックス
  const isManuallyStoppedRef = useRef<boolean>(true);

  // コールバックの最新を保持するref（useEffect内でのstale closure対策）
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  const clearBreakTimers = useCallback(() => {
    if (shortBreakTimerRef.current) clearTimeout(shortBreakTimerRef.current);
    if (longBreakTimerRef.current) clearTimeout(longBreakTimerRef.current);
    shortBreakTimerRef.current = null;
    longBreakTimerRef.current = null;
  }, []);

  const normalizeText = useCallback((text: string) => {
    if (!smartNormalize) return text.trim();
    let normalized = text.trim();
    // 日本語文字（全角文字）と半角スペースが隣接している場合、そのスペースを削除
    normalized = normalized.replace(/([^\x00-\x7F]) +/g, "$1");
    normalized = normalized.replace(/ +([^\x00-\x7F])/g, "$1");
    // 連続スペースは1つに圧縮
    normalized = normalized.replace(/ +/g, " ");
    return normalized;
  }, [smartNormalize]);

  // 文字列の類似度を計算する (Jaccard係数 + bi-gram)
  const getSimilarity = useCallback((str1: string, str2: string) => {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const getGrams = (s: string) => {
      const grams = new Set<string>();
      for (let i = 0; i < s.length - 1; i++) {
        grams.add(s.substring(i, i + 2));
      }
      return grams;
    };

    const grams1 = getGrams(str1);
    const grams2 = getGrams(str2);

    if (grams1.size === 0 || grams2.size === 0) {
      // 1文字のみの場合などは単純比較
      return str1 === str2 ? 1 : 0;
    }

    const intersection = new Set([...grams1].filter(x => grams2.has(x)));
    const union = new Set([...grams1, ...grams2]);

    return intersection.size / union.size;
  }, []);

  // 確定したチャンクを通知する内部関数
  const notifyFinal = useCallback((text: string) => {
    if (!text || !onFinalRef.current) return;
    
    // 基本的な重複ガード: 直前のチャンクと全く同じならスキップ
    // ただし改行("\n")の場合は特別な判定を行う
    if (text === "\n") {
       // 直前が "\n" かつ、その前（lastFlushedChunkRef 以前の状態）を知る術がここにはないが、
       // シンプルに「直前が \n なら、次は \n まで許容するが、それ以上は送らない」という
       // 状態管理を簡易化するため、lastFlushedChunkRef に "\n\n" を保持させる運用にする。
       
       if (lastFlushedChunkRef.current === "\n\n") {
         // 既に2連改行済みなら、これ以上の改行は送らない
         return;
       }
       
       onFinalRef.current(text);
       
       // 直前が \n だったなら、次は \n\n という状態にする
       if (lastFlushedChunkRef.current === "\n") {
         lastFlushedChunkRef.current = "\n\n";
       } else {
         lastFlushedChunkRef.current = "\n";
       }
       return;
    }

    // "\n" 以外のテキスト重複ガード
    if (text === lastFlushedChunkRef.current) return;

    onFinalRef.current(text);
    lastFlushedChunkRef.current = text;
  }, []);

  // interim を強制的に final として通知する（無音検知時など）
  const flushInterimToFinal = useCallback(() => {
    const interim = latestInterimRef.current.trim();
    if (!interim) return;

    const normalized = normalizeText(interim);

    // 差し引きロジック: 
    // ここでも interimFlushedRef を使って、既にFlush済みの部分を除去してから通知する
    let textToNotify = normalized;
    const flushed = interimFlushedRef.current;
    
    // 類似度判定によるガード:
    // 既にFlush済みの内容と、今回の内容が非常に似ている（80%以上）なら、
    // 表記揺れ（漢字変換の差など）とみなしてスキップする
    if (flushed && getSimilarity(flushed, normalized) > 0.8) {
      return;
    }

    // 単純な startsWith チェック
    if (flushed && normalized.startsWith(flushed)) {
       textToNotify = normalized.slice(flushed.length);
    }
    
    // 差分がなければ通知しない（既に全量Flush済み）
    if (!textToNotify) return;

    notifyFinal(textToNotify); // 差分だけを通知

    // 独自に確定させた分を記録する（今回の差分だけを追記）
    // ※ interimFlushedRef は「これまでにFlushした累積」なので、
    //   単純に += textToNotify で正しい。
    //   元々 flushed(=累積) + textToNotify(=差分) = normalized(=全量) となる。
    interimFlushedRef.current += textToNotify;

    // ここで interimText はクリアするが、APIからはまだ同じ interim が送られてくる可能性がある
    // それは onresult 側で interimFlushedRef を使って差し引いて表示する
    setInterimText("");
    latestInterimRef.current = "";
  }, [normalizeText, notifyFinal]);

  const appendShortBreak = useCallback(() => {
    // 改行のみを通知
    notifyFinal("\n");
  }, [notifyFinal]);


  const scheduleBreakTimers = useCallback(() => {
    clearBreakTimers();
    if (!autoLineBreak) return;

    // 1.1s: Flush + \n
    shortBreakTimerRef.current = setTimeout(() => {
      flushInterimToFinal();
      appendShortBreak();
    }, pauseMs);

    // 4.0s: \n\n (空行)
    longBreakTimerRef.current = setTimeout(() => {
      // 既に shotBreak で flush されているはずだが、念のため
      // ここでは追加の改行を送る
      // ※ ShortBreakで1つ送っているので、あと1つ送れば合計2つになる？
      //   実装をシンプルにするため、LongBreak時は「追加で1つ送る」判定にするか、
      //   あるいは「ShortBreak後にタイマーセットする」構造にするか。
      //   現状は並列で走っているので、4秒後は「既に1秒後のが走った後」である。
      //   なので、追加でもう1個送れば \n\n になる。
      appendShortBreak(); 
    }, 4000);
  }, [autoLineBreak, pauseMs, flushInterimToFinal, appendShortBreak, clearBreakTimers]);

  const appendNewline = useCallback(() => {
    notifyFinal("\n\n");
  }, [notifyFinal]);

  const start = useCallback(() => {
    isManuallyStoppedRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setError(undefined);
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
  }, []);

  const stop = useCallback(() => {
    isManuallyStoppedRef.current = true;
    flushInterimToFinal();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearBreakTimers();
  }, [clearBreakTimers, flushInterimToFinal]);

  // clear は呼び出し元が state を消せばいいだけなので、hook 内では管理しないが、
  // interim は消す必要がある。
  const clear = useCallback(() => {
    setInterimText("");
    latestInterimRef.current = "";
    lastFlushedChunkRef.current = "";
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      resultCountRef.current = 0;
      processedResultIndexRef.current = 0;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let newlyFinal = "";

      // 処理済みのインデックス以降のみを対象とする
      // ※ Safari等では continuous: true の時に過去の結果も含めて返してくる場合があるため
      const startIndex = processedResultIndexRef.current;
      
      for (let i = startIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          newlyFinal += transcript;
          // Finalとして処理したら、処理済みインデックスを進める
          processedResultIndexRef.current = i + 1;
        } else {
          interim += transcript;
        }
      }

      if (newlyFinal) {
        clearBreakTimers();
        latestInterimRef.current = "";
        setInterimText("");
        
        // 確定処理
        const normalized = normalizeText(newlyFinal);

        // 差し引きロジック:
        // アプリ側で既にFlushした内容(interimFlushedRef)と、APIのFinal結果を比較する
        let textToNotify = normalized;
        const flushed = interimFlushedRef.current;

        // 類似度判定によるガード: 80%以上一致なら重複とみなす
        if (flushed && getSimilarity(flushed, normalized) > 0.8) {
           interimFlushedRef.current = ""; 
           return;
        }

        if (flushed && normalized.startsWith(flushed)) {
          textToNotify = normalized.slice(flushed.length);
          // 完全に一致または包含されていたので、Flush記録はここで消費・リセット
          interimFlushedRef.current = ""; 
        } else if (flushed) {
          // もし一致しなければ（読みが修正された等）、
          // 仕方ないのでFlush記録は破棄し、APIの結果をそのまま採用（重複する可能性はあるが、欠落よりマシ）
          // または、重複を恐れて notify を控える手もあるが、修正された場合は新しい方が正しいはず。
          interimFlushedRef.current = "";
        }

        if (textToNotify) {
          notifyFinal(textToNotify);
        }

      } else if (interim) {
        const trimmedInterim = interim.trim();
        const normalizedInterim = normalizeText(trimmedInterim);
        let displayInterim = trimmedInterim;

        // Interim表示の差し引き:
        // 既にFlushした分がInterimに含まれていれば、画面表示からは消す
        if (interimFlushedRef.current && normalizedInterim.startsWith(interimFlushedRef.current)) {
          // 単純なsliceだと、normalize前のスペース等がズレる可能性あるが、
          // 概ねの表示用なので、normalize後の長さ分だけ先頭から削る、等の簡易処理とする
          // ※厳密には元テキスト上の位置を特定すべきだが、ここでは簡易的に normalized ベースで比較
          
          // 表示用には、元の trimmedInterim を使いたいが、比較は normalized で行うジレンマ
          // ここでは「既に確定した分」はもうユーザーに見えているので、
          // normalizedInterim から flushed 分を除去した残りの文字列を表示用とする
          displayInterim = normalizedInterim.slice(interimFlushedRef.current.length);
        }

        setInterimText(displayInterim);
        latestInterimRef.current = trimmedInterim;
      }

      if (interim || newlyFinal) {
        scheduleBreakTimers();
      }

      // 長時間入力対策: リフレッシュ
      // interim で回数を稼ぎすぎないよう閾値を上げつつ、
      // 必ず「文が確定したタイミング(newlyFinalがある時)」にのみリフレッシュする
      resultCountRef.current += 1;
      if (resultCountRef.current > 50 && newlyFinal) {
        console.log("Refreshing speech recognition session...");
        recognition.stop();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "no-speech") {
        flushInterimToFinal();
        setError(event.error);
      }
      if (!isManuallyStoppedRef.current) {
        console.warn("Speech recognition error/restart:", event.error);
      } else {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      flushInterimToFinal();
      setInterimText("");
      // 手動停止でない(=自動再起動する)場合は、無音タイマーをクリアせず維持する
      // これにより、再接続中も「無音時間」としてカウントされ続け、改行が正しく入るようになる
      if (isManuallyStoppedRef.current) {
        clearBreakTimers();
      }

      if (!isManuallyStoppedRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart:", e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isManuallyStoppedRef.current = true;
      recognition.stop();
      clearBreakTimers();
    };
  }, [lang, autoLineBreak, pauseMs, normalizeText, flushInterimToFinal, scheduleBreakTimers, clearBreakTimers, notifyFinal]);

  return {
    interimText,
    isListening,
    isSupported,
    error,
    start,
    stop,
    clear,
    appendNewline,
  };
};
