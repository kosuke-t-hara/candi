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
  const resultCountRef = useRef<number>(0); 
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

  // 確定したチャンクを通知する内部関数
  const notifyFinal = useCallback((text: string) => {
    if (!text || !onFinalRef.current) return;
    
    // 直前のチャンクと全く同じならスキップ（重複ガード）
    // ただし、改行のみ(\n)の場合は 1.1秒後と4.0秒後で連続して送る必要があるため除外
    if (text !== "\n" && text === lastFlushedChunkRef.current) return;

    onFinalRef.current(text);
    lastFlushedChunkRef.current = text;
  }, []);

  // interim を強制的に final として通知する（無音検知時など）
  const flushInterimToFinal = useCallback(() => {
    const interim = latestInterimRef.current.trim();
    if (!interim) return;

    const normalized = normalizeText(interim);
    notifyFinal(normalized);

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
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let newlyFinal = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newlyFinal += transcript;
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
        notifyFinal(normalized);

      } else if (interim) {
        const trimmedInterim = interim.trim();
        setInterimText(trimmedInterim);
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
