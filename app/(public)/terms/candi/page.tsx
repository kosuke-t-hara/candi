import Link from "next/link"
import { Noto_Sans_JP } from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function CandiTermsPage() {
  return (
    <div className={`${notoSansJP.className} min-h-screen bg-white text-slate-900 selection:bg-blue-100`}>
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <header className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Candi 利用規約</h1>
        </header>

        <main className="prose prose-slate prose-sm md:prose-base max-w-none">
          <div className="mb-10 text-slate-600 leading-relaxed">
            <p>本規約は、Candi サービスの利用条件を定めるものです。</p>
          </div>

          <section className="space-y-12">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Candi サービス固有条項</h2>
              <div className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  （ここに Candi サービス固有の利用条件が掲載されます）
                </p>
                <p className="text-slate-400 italic">
                  ※ 文面は後ほど提供されるため、現在は枠組みのみを表示しています。
                </p>
              </div>
            </div>
          </section>

          <footer className="mt-20 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 leading-relaxed">
              本規約に定めのない事項については、{" "}
              <Link
                href="/terms/platform"
                className="text-slate-600 underline underline-offset-4 decoration-slate-200 transition-colors hover:text-blue-600 hover:decoration-blue-400"
              >
                Toro プラットフォーム利用規約
              </Link>
              {" "}が適用されます。
            </p>
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                トップページへ戻る
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
