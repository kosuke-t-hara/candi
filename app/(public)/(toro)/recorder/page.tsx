"use client";

import { ToroRecorder } from "@/app/components/ToroRecorder";

export default function SpeechRecorderPage() {
  return (
    <div className="max-w-screen-md mx-auto py-12 px-6">
      <div className="mb-12 space-y-4">
        <h1 className="text-3xl font-light tracking-widest text-black/80">
          文字起こしの実験室
        </h1>
        <p className="text-sm font-light leading-relaxed text-black/40">
          声が文字に変わる様子を、ここで試してみることができます。<br />
          日本語の語尾や「。、」の代わりに、自動で改行が入る心地よさを感じてみてください。
        </p>
      </div>

      <ToroRecorder />

      <footer className="mt-24 pt-8 border-t border-black/5">
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-black/20">
            この実装のこだわり
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {[
              "日本語の不要なスペースを除去",
              "英数字間のスペースは維持",
              "「です/ます」等の語尾で自動改行",
              "1.1秒の無音で自動改行",
              "未確定テキストを薄くプレビュー表示",
              "マイク停止で未確定分をクリア",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-[11px] font-light text-black/40">
                <span className="w-1 h-1 bg-black/10 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
