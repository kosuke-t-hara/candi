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
          <div className="mb-10 p-6 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
            <p className="font-medium text-slate-800 mb-2">本規約は、Toro プラットフォーム全体の利用条件を定めるものです。</p>
          </div>

          <div className="space-y-10 text-slate-700 pb-20">
            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第1条（目的・適用範囲）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>本利用規約（以下「本規約」といいます）は、Toro（以下「当社」といいます）が提供するプラットフォーム「Toro」（以下「本プラットフォーム」といいます）の利用条件を定めるものです。</li>
                <li>本規約は、本プラットフォーム上で提供されるすべてのサービス（以下「本サービス」といいます）に共通して適用されます。</li>
                <li>本サービスには、Candi、Toroその他当社が提供する個別サービス（以下「個別サービス」といいます）が含まれます。</li>
                <li>個別サービスには、本規約とは別に、当該サービスに固有の利用条件（以下「サービス固有条項」といいます）が定められる場合があります。</li>
                <li>本規約とサービス固有条項の内容が異なる場合には、当該個別サービスに関してはサービス固有条項が優先して適用されるものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第2条（定義）</h2>
              <p className="mb-3">本規約において使用する用語の定義は、以下のとおりとします。</p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>「ユーザー」とは、本規約に同意のうえ、本プラットフォームを利用するすべての個人または法人をいいます。</li>
                <li>「コンテンツ」とは、文章、画像、音声、動画、データその他形式を問わず、本プラットフォーム上でユーザーが入力、投稿、保存、送信または生成した情報をいいます。</li>
                <li>「ユーザーコンテンツ」とは、コンテンツのうち、ユーザー自身が作成または入力したものをいいます。</li>
                <li>「外部サービス」とは、当社以外の第三者が提供するサービス、システムまたはプラットフォームをいいます。</li>
                <li>「アカウント」とは、本プラットフォームを利用するために当社が付与する識別情報をいいます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第3条（規約への同意）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>ユーザーは、本規約の内容を理解し、同意したうえで本プラットフォームを利用するものとします。</li>
                <li>ユーザーが本プラットフォームを利用した時点で、本規約に有効かつ取消不能な同意があったものとみなします。</li>
                <li>未成年者が本プラットフォームを利用する場合には、法定代理人の同意を得たうえで利用するものとします。</li>
                <li>ユーザーが本規約に同意できない場合には、本プラットフォームを利用することはできません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第4条（アカウント管理）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>ユーザーは、自己の責任においてアカウントを管理するものとします。</li>
                <li>ユーザーは、登録情報に虚偽、誤記または変更漏れがないよう、正確かつ最新の情報を維持するものとします。</li>
                <li>アカウントを通じて行われた一切の行為は、当該アカウントを保有するユーザー自身の行為とみなされます。</li>
                <li>アカウントの不正利用が判明した場合、ユーザーは速やかに当社に通知するものとします。</li>
                <li>当社は、アカウントの不正利用等によりユーザーに生じた損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第5条（サービス内容の変更・中断・終了）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、ユーザーへの事前の通知なく、本サービスの内容を変更、追加または廃止することができます。</li>
                <li>当社は、以下の事由により、本サービスの全部または一部を一時的に中断または停止することがあります。
                  <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                    <li>システムの保守、点検または更新を行う場合</li>
                    <li>通信回線や設備に障害が発生した場合</li>
                    <li>天災地変その他不可抗力により提供が困難となった場合</li>
                  </ul>
                </li>
                <li>当社は、本サービスの変更、中断または終了によりユーザーに生じた損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第6条（禁止事項）</h2>
              <p className="mb-3">ユーザーは、本プラットフォームの利用にあたり、以下の行為を行ってはなりません。</p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>他者の知的財産権、プライバシー、名誉その他の権利を侵害する行為</li>
                <li>不正アクセス、システムへの過度な負荷をかける行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>反社会的勢力への利益供与または関与</li>
                <li>当社が不適切と判断するその他の行為</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第7条（ユーザーコンテンツ）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>ユーザーは、自己の責任においてユーザーコンテンツを本プラットフォームに投稿、保存または送信するものとします。</li>
                <li>当社は、ユーザーコンテンツの内容について、監視、管理または保存義務を負うものではありません。</li>
                <li>ユーザーコンテンツに起因して生じた紛争または損害については、ユーザー自身が責任を負うものとします。</li>
                <li>当社は、法令遵守、サービス運営または不正行為防止の目的に限り、必要な範囲でユーザーコンテンツを閲覧、利用することがあります。</li>
                <li>なお、個別サービスの性質に応じて、ユーザーコンテンツの取扱いについては、サービス固有条項に別途定める場合があります。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第8条（知的財産権）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>本プラットフォームおよび本サービスに関する著作権、商標権その他一切の知的財産権は、当社または正当な権利を有する第三者に帰属します。</li>
                <li>ユーザーは、本規約に基づく利用の範囲を超えて、本プラットフォームまたは本サービスの内容を複製、改変、転載、公開または二次利用してはなりません。</li>
                <li>ユーザーコンテンツに関する著作権は、当該ユーザーに帰属します。ただし、当社は、本サービスの提供、改善、運営および広報の目的に限り、無償で利用（複製、保存、翻案を含みます）できるものとします。</li>
                <li>前項の利用は、ユーザーコンテンツの内容や趣旨を不当に歪める形で行われるものではありません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第9条（外部サービスとの連携）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>本サービスは、外部サービスと連携する機能を含む場合があります。</li>
                <li>外部サービスの利用にあたっては、当該外部サービスの利用規約が適用されるものとします。</li>
                <li>当社は、外部サービスの内容、動作、継続性または安全性について、一切保証するものではありません。</li>
                <li>外部サービスの利用または連携に起因してユーザーに生じた損害について、当社は一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第10条（料金および支払い）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>本サービスの一部は、将来有料で提供される場合があります。</li>
                <li>有料サービスの内容、料金、支払方法および支払時期については、当社が別途定め、ユーザーに通知します。</li>
                <li>ユーザーは、当社が定める条件に従い、所定の料金を支払うものとします。</li>
                <li>既に支払われた料金については、法令に別段の定めがある場合を除き、返金されないものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第11条（保証の否認）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、本サービスがユーザーの特定の目的に適合すること、期待する結果をもたらすこと、正確性、完全性または有用性について、いかなる保証も行いません。</li>
                <li>本サービスを通じて提供される情報、助言、示唆その他の内容は、ユーザー自身の判断と責任において利用されるものとします。</li>
                <li>当社は、本サービスに不具合、エラーまたは中断が生じないことを保証するものではありません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第12条（免責および責任制限）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、本サービスの利用または利用不能によりユーザーに生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。</li>
                <li>当社が責任を負う場合であっても、その範囲は、当該損害が発生したサービスについて当社がユーザーから受領した対価の総額を上限とします。</li>
                <li>当社は、間接損害、特別損害、逸失利益について責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第13条（利用停止・登録抹消）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、ユーザーが以下のいずれかに該当する場合、事前の通知なく、当該ユーザーの利用を停止またはアカウントを抹消することができます。
                  <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                    <li>本規約に違反した場合</li>
                    <li>登録情報に虚偽があった場合</li>
                    <li>長期間利用がない場合</li>
                    <li>その他当社が不適切と判断した場合</li>
                  </ul>
                </li>
                <li>当社は、前項に基づく措置によりユーザーに生じた損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第14条（個人情報の取扱い）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、ユーザーの個人情報を, 別途定めるプライバシーポリシーに従って適切に取り扱います。</li>
                <li>本規約とプライバシーポリシーの内容が異なる場合には、プライバシーポリシーが優先されます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第15条（規約の変更）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社は、必要に応じて、本規約の内容を変更することができます。</li>
                <li>本規約を変更する場合、当社は、変更内容および効力発生日を、当社が適切と判断する方法でユーザーに通知します。</li>
                <li>変更後の規約は、効力発生日以降に本サービスを利用した時点で、ユーザーが同意したものとみなされます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第16条（通知・連絡）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>当社からユーザーへの通知または連絡は、本サービス上の表示、電子メールその他当社が適切と判断する方法により行います。</li>
                <li>当該通知が発信された時点で、ユーザーに到達したものとみなします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第17条（権利義務の譲渡禁止）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>ユーザーは、本規約に基づく権利または義務を、第三者に譲渡または担保に供することはできません。</li>
                <li>当社は、事業譲渡、合併その他事業の承継に伴い、本規約上の地位、権利および義務を第三者に譲渡することができるものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第18条（分離可能性）</h2>
              <p>本規約のいずれかの条項が無効または執行不能と判断された場合であっても、他の条項は引き続き有効に存続するものとします。</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">第19条（準拠法および管轄）</h2>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>本規約は、日本法に準拠し解釈されるものとします。</li>
                <li>本規約または本サービスに関して生じた紛争については、当社の本店所在地を管轄する地方裁判所を、第一審の専属的合意管轄裁判所とします。</li>
              </ol>
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
