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
          <div className="mb-12 text-slate-600 leading-relaxed space-y-4">
            <p>本規約は、Candi サービスの利用条件を定めるものです。</p>
            <p className="text-xs text-slate-400">（Toro プラットフォーム利用規約に基づく）</p>
          </div>

          <div className="mb-16 p-8 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed space-y-4 shadow-sm">
            <p>
              Candi は、転職やキャリアに関する意思決定の過程を、記録し、整理し、振り返るための場を提供するサービスです。
            </p>
            <p>
              本サービスは、正解を提示したり、特定の選択を推奨したり、結果を保証するものではありません。
            </p>
            <p>
              迷い、悩み、考え続ける過程そのものを可視化し、ユーザー自身が納得のいく判断を行うための補助として機能することを目的としています。
            </p>
          </div>

          <section className="space-y-16 pb-20">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第1条（本条項の位置づけ）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本条項は、Toro プラットフォーム利用規約（以下「親規約」といいます）に基づき、Candi（以下「本サービス」といいます）の利用条件を定めるものです。</li>
                <li>本サービスの利用にあたっては、親規約および本条項の双方が適用されます。</li>
                <li>親規約と本条項の内容が異なる場合には、本サービスに関しては本条項が優先して適用されます。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第2条（本サービスの性質）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスは、ユーザーの転職活動、キャリア形成および意思決定を支援するための情報整理、記録および対話の場を提供することを目的としています。</li>
                <li>本サービスは、特定の進路、選択または結果を推奨、保証または強制するものではありません。</li>
                <li>本サービス上で提供される機能、表示内容または生成される情報は、ユーザー自身の判断を補助するものであり、最終的な意思決定はユーザー自身の責任において行われるものとします。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第3条（情報の正確性および完全性）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスにおいてユーザーが入力、保存または管理する情報は、ユーザー自身が提供するものであり、その正確性、完全性および最新性については、ユーザー自身が責任を負うものとします。</li>
                <li>当社は、本サービス上で扱われる転職情報、企業情報、求人情報または関連データの正確性、最新性または完全性について、いかなる保証も行いません。</li>
                <li>本サービス上の情報が現実の状況と異なる場合であっても、当社はその責任を負いません。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第4条（助言・示唆・生成情報について）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスには、ユーザーの入力内容をもとに、助言、示唆、整理結果または生成情報を提示する機能が含まれる場合があります。</li>
                <li>これらの内容は、一般的な情報提供または思考整理を目的としたものであり、専門的助言（法的助言、医療行為、職業紹介行為等）を構成するものではなく、当社は職業安定法その他関連法令に基づく職業紹介事業者ではありません。</li>
                <li>ユーザーは、これらの情報を参考情報として利用するものとし、その内容を採用するか否かは、ユーザー自身の判断に委ねられます。</li>
                <li>当社は、これらの情報に基づいてユーザーが行った判断または行動の結果について、一切の責任を負いません。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第5条（転職活動・応募行為との関係）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスは、求人への応募、選考への参加または内定の獲得を保証するものではありません。</li>
                <li>ユーザーが行う応募、面接、条件交渉その他一切の転職活動は、ユーザー自身と第三者（企業、採用担当者、エージェント等）との間で行われるものとします。</li>
                <li>当社は、ユーザーと第三者との間で生じたトラブル、紛争または損害について、一切の責任を負いません。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第6条（外部サービスおよび第三者情報）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスは、外部の求人サービス、カレンダー、メールサービスその他第三者が提供するサービスと連携する場合があります。</li>
                <li>これらの外部サービスの内容、仕様、提供条件または継続性については、当社は一切関与せず、保証しません。</li>
                <li>外部サービスの変更、停止または終了により本サービスの一部が利用できなくなった場合であっても、当社は責任を負いません。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第7条（データの保存および消失）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>当社は、本サービスにおいてユーザーコンテンツを保存するよう努めますが、その永続的な保存を保証するものではありません。</li>
                <li>システム障害、仕様変更、サービス終了その他の理由により、ユーザーコンテンツが消失、破損または閲覧不能となる場合があります。</li>
                <li>ユーザーは、必要に応じて、自己の責任においてデータのバックアップを行うものとします。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第8条（実験的機能・β機能）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスには、試験的、実験的またはβ版として提供される機能が含まれる場合があります。</li>
                <li>これらの機能は、予告なく変更、停止または削除されることがあります。</li>
                <li>実験的機能の利用により生じた不具合、損害または不利益について、当社は一切の責任を負いません。</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第9条（利用停止等）</h2>
              <p className="text-slate-700 leading-relaxed">
                当社は、ユーザーが本条項または親規約に違反した場合、本サービスの全部または一部の利用を停止し、またはアカウントを制限することがあります。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">第10条（本条項の変更）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>当社は、本サービスの内容変更または運営上の必要に応じて、本条項を変更することがあります。</li>
                <li>本条項の変更については、親規約の定めに従い通知および効力が発生するものとします。</li>
              </ol>
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
                href="/lp/candi"
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
