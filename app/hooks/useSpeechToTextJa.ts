"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API interfaces for TypeScript
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
}

export const useSpeechToTextJa = (options: UseSpeechToTextJaOptions = {}) => {
  const {
    lang = "ja-JP",
    pauseMs = 1100,
    autoLineBreak = true,
    smartNormalize = true,
  } = options;

  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shortBreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longBreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestInterimRef = useRef<string>("");
  const isManuallyStoppedRef = useRef<boolean>(true);

  // 語尾と感嘆疑問で改行を入れる正規表現（Web Speech API の特性に合わせ、文末のゆらぎを考慮）
  const lineBreakRegex = /(です|ます|でした|ました|ません|ますね|ですね|でしたね|だよ|だね|かな|かも|よね|じゃん|だな|[！？\?\!])\s*$/;

  const clearBreakTimers = useCallback(() => {
    if (shortBreakTimerRef.current) clearTimeout(shortBreakTimerRef.current);
    if (longBreakTimerRef.current) clearTimeout(longBreakTimerRef.current);
    shortBreakTimerRef.current = null;
    longBreakTimerRef.current = null;
  }, []);

  const normalizeText = useCallback((text: string) => {
    if (!smartNormalize) return text.trim();
    // 全端をトリミング
    let normalized = text.trim();
    // 日本語文字（全角文字）と半角スペースが隣接している場合、そのスペースを削除
    normalized = normalized.replace(/([^\x00-\x7F]) +/g, "$1");
    normalized = normalized.replace(/ +([^\x00-\x7F])/g, "$1");
    // 連続スペースは1つに圧縮（改行は触らない）
    normalized = normalized.replace(/ +/g, " ");
    return normalized;
  }, [smartNormalize]);

  const flushInterimToFinal = useCallback(() => {
    const interim = latestInterimRef.current.trim();
    if (!interim) return;

    const normalized = normalizeText(interim);
    setFinalText((prev) => {
      const trimmedBase = prev.replace(/[ \u3000]+$/, "");

      // 重複ガード: 既に追加予定のテキストが末尾にある場合は何もしない
      if (trimmedBase.endsWith(normalized)) return prev;

      if (!trimmedBase) return normalized;

      // スマート・コネクタ
      // 前の末尾が英数字かつ次の先頭が英数字の場合のみスペースを入れる
      const lastChar = trimmedBase.slice(-1);
      const nextChar = normalized.charAt(0);
      const isAlphanumeric = (char: string) => /[a-zA-Z0-9]/.test(char);
      
      let separator = "";
      if (trimmedBase.endsWith("\n")) {
        separator = "";
      } else if (isAlphanumeric(lastChar) && isAlphanumeric(nextChar)) {
        separator = " ";
      }

      return trimmedBase + separator + normalized;
    });

    setInterimText("");
    latestInterimRef.current = "";
  }, [normalizeText]);

  const appendShortBreak = useCallback(() => {
    setFinalText((prev) => {
      if (!prev) return prev;
      // 既に改行がある場合は追加しない
      if (prev.endsWith("\n")) return prev;
      return prev.replace(/[ \u3000]+$/, "") + "\n";
    });
  }, []);

  const appendLongBreak = useCallback(() => {
    setFinalText((prev) => {
      if (!prev) return prev;
      // 既に2つ以上の改行がある場合は追加しない
      if (prev.endsWith("\n\n")) return prev;
      
      const trimmed = prev.replace(/[ \u3000]+$/, "");
      // 既に1つの改行がある場合は、1つだけ追加して \n\n にする
      if (trimmed.endsWith("\n")) return trimmed + "\n";
      // 改行がない場合は、\n\n を追加して空行を作る
      return trimmed + "\n\n";
    });
  }, []);

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
      appendLongBreak();
    }, 4000);
  }, [autoLineBreak, pauseMs, flushInterimToFinal, appendShortBreak, appendLongBreak, clearBreakTimers]);

  const appendNewline = useCallback(() => {
    setFinalText((prev) => {
      if (!prev) return prev;
      const trimmed = prev.replace(/[ \u3000]+$/, "");
      return trimmed + "\n\n";
    });
  }, []);

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

  const clear = useCallback(() => {
    setFinalText("");
    setInterimText("");
    latestInterimRef.current = "";
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

      // newlyFinal がある場合は Flush タイマーを即座に消去し、重複を避ける
      if (newlyFinal) {
        clearBreakTimers();
        latestInterimRef.current = ""; // Flush 対象をクリア
        setInterimText("");
      } else {
        const trimmedInterim = interim.trim();
        setInterimText(trimmedInterim);
        latestInterimRef.current = trimmedInterim;
      }

      // 動き（interim または newlyFinal）があればタイマーをリセットして 2段階Flush 予約
      if (interim || newlyFinal) {
        scheduleBreakTimers();
      }

      if (newlyFinal) {
        const normalized = normalizeText(newlyFinal);
        setFinalText((prev) => {
          const trimmedBase = prev.replace(/[ \u3000]+$/, "");

          // 重複ガード
          if (trimmedBase.endsWith(normalized)) return prev;

          let updated;
          if (!trimmedBase) {
            updated = normalized;
          } else {
            // スマート・コネクタ
            const lastChar = trimmedBase.slice(-1);
            const nextChar = normalized.charAt(0);
            const isAlphanumeric = (char: string) => /[a-zA-Z0-9]/.test(char);
            
            let separator = "";
            if (trimmedBase.endsWith("\n")) {
              separator = "";
            } else if (isAlphanumeric(lastChar) && isAlphanumeric(nextChar)) {
              separator = " ";
            }
            updated = trimmedBase + separator + normalized;
          }
          
          // 語尾検知時は空行（2連改行）を入れて段落を作る
          // if (autoLineBreak && lineBreakRegex.test(updated)) {
          //   updated = updated.replace(/[ \u3000]+$/, "") + "\n\n";
          // }
          return updated;
        });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "no-speech") {
        flushInterimToFinal();
        setError(event.error);
      }
      if (!isManuallyStoppedRef.current) {
        console.warn("Speech recognition error, attempting restart:", event.error);
      } else {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      flushInterimToFinal();
      setInterimText("");
      clearBreakTimers();

      if (!isManuallyStoppedRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
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
  }, [lang, autoLineBreak, pauseMs, normalizeText, flushInterimToFinal, scheduleBreakTimers, clearBreakTimers]);

  return {
    finalText,
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
