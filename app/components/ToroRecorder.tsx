"use client";

import { useSpeechToTextJa } from "@/app/hooks/useSpeechToTextJa";
import { Mic, MicOff, Trash2, CornerDownLeft, Loader2 } from "lucide-react";

interface ToroRecorderProps {
  onTextChanged?: (text: string) => void;
  initialText?: string;
}

export const ToroRecorder = ({ onTextChanged, initialText = "" }: ToroRecorderProps) => {
  const {
    finalText,
    interimText,
    isListening,
    isSupported,
    error,
    start,
    stop,
    clear,
    appendNewline,
  } = useSpeechToTextJa({
    pauseMs: 1100,
    autoLineBreak: true,
    smartNormalize: true,
  });

  // finalText が更新されたら親コンポーネントに通知したい場合などの処理
  // 今回は単純な表示用として実装

  if (!isSupported) {
    return (
      <div className="p-4 border border-red-100 rounded-lg bg-red-50/50 text-red-500 text-sm font-light">
        お使いのブラウザは音声認識に対応していません。Chrome等の対応ブラウザをお試しください。
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stop : start}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-light tracking-widest transition-all duration-500 ${
              isListening
                ? "bg-black/5 text-black/60 ring-1 ring-black/10"
                : "bg-black/90 text-white hover:bg-black shadow-sm"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>停止</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>録音開始</span>
              </>
            )}
          </button>

          {isListening && (
            <div className="flex items-center gap-1.5 px-3">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/30 font-medium">
                Listening...
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={appendNewline}
            className="p-2.5 text-black/30 hover:text-black/60 hover:bg-black/5 rounded-full transition-all"
            title="改行を入れる"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
          <button
            onClick={clear}
            className="p-2.5 text-black/30 hover:text-red-400/60 hover:bg-red-50/50 rounded-full transition-all"
            title="クリア"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400/70 font-light px-2 animate-in fade-in slide-in-from-top-1">
          エラー: {error}
        </div>
      )}

      <div className="relative min-h-[200px] p-6 bg-transparent border border-black/5 rounded-2xl group transition-all duration-500 hover:border-black/10">
        <div className="absolute inset-0 bg-black/[0.01] rounded-2xl -z-10" />
        
        <div className="whitespace-pre-wrap text-lg font-light leading-relaxed tracking-wide text-black/70">
          {finalText ? (
            <span>{finalText}</span>
          ) : !interimText && !isListening ? (
            <span className="text-black/10 italic">ここに声が文字になって届きます。</span>
          ) : null}
          
          {interimText && (
            <span className="text-black/30 italic opacity-60 ml-0.5 animate-in fade-in duration-300">
              {interimText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
