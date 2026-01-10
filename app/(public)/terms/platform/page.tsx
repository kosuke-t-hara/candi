import Link from "next/link"
import { Noto_Sans_JP } from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function PlatformTermsPage() {
  return (
    <div className={`${notoSansJP.className} min-h-screen bg-slate-50 text-slate-800`}>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20 bg-white shadow-sm border-x border-slate-100 min-h-screen">
        <header className="mb-10 text-center">
          <h1 className="text-xl font-bold text-slate-900">Toro プラットフォーム利用規約</h1>
        </header>

        <main className="text-sm md:text-base leading-relaxed">
          <div className="mb-8 p-4 bg-slate-50 rounded-md border border-slate-100 text-slate-600">
            <p>本規約は、Toro プラットフォーム全体の利用条件を定めるものです。</p>
          </div>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="font-bold border-b border-slate-200 pb-1 mb-3">Toro プラットフォーム規約本文</h2>
              <div className="space-y-4">
                <p>
                  （ここに Toro プラットフォーム利用規約の全文が掲載されます）
                </p>
                <p className="text-slate-400 italic">
                  ※ 文面は後ほど提供されるため、現在は枠組みのみを表示しています。
                </p>
              </div>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <p>© Toro Platform</p>
            <Link
              href="/terms/candi"
              className="hover:text-slate-600 transition-colors"
            >
              Candi 利用規約へ戻る
            </Link>
          </footer>
        </main>
      </div>
    </div>
  )
}
