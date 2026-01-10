import Link from "next/link"
import { Noto_Sans_JP } from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function RoadmapPage() {
  return (
    <div className={`${notoSansJP.className} min-h-screen bg-white text-slate-900 selection:bg-blue-100`}>
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <header className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">開発ロードマップ</h1>
        </header>

        <main className="prose prose-slate prose-sm md:prose-base max-w-none">
          <div className="mb-12 text-slate-600 leading-relaxed space-y-4">
            <p>
              Candiは、ユーザーの皆様の「納得」ある意思決定をサポートするため、日々機能の改善と追加を行っています。
            </p>
            <p>
              現在、以下の機能開発や改善を予定しています。
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-xl border border-slate-100 text-center text-slate-500">
             <p>現在、ロードマップを準備中です。</p>
             <p className="mt-2 text-sm">公開まで今しばらくお待ちください。</p>
          </div>

          <footer className="mt-20 pt-8 border-t border-slate-100 text-center">
            <Link
              href="/lp/candi"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              トップページへ戻る
            </Link>
          </footer>
        </main>
      </div>
    </div>
  )
}
