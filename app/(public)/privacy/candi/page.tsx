import Link from "next/link"
import { Noto_Sans_JP } from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function CandiPrivacyPage() {
  return (
    <div className={`${notoSansJP.className} min-h-screen bg-white text-slate-900 selection:bg-blue-100`}>
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <header className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">プライバシーポリシー</h1>
        </header>

        <main className="prose prose-slate prose-sm md:prose-base max-w-none">
          <div className="mb-12 text-slate-600 leading-relaxed space-y-4">
            <p>
              Candi（以下「本サービス」といいます）は、ユーザーの思考・判断・振り返りを支援することを目的としたサービスです。
              本サービスは、ユーザーのプライバシーを尊重し、個人情報を適切に取り扱うことを重要な責務と考えています。
            </p>
            <p>
              本プライバシーポリシーは、本サービスにおける個人情報の取扱いについて定めるものです。
            </p>
          </div>

          <section className="space-y-16 pb-20">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">1. 取得する情報</h2>
              <p className="mb-4 text-slate-700">本サービスでは、以下の情報を取得する場合があります。</p>
              
              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">(1) ユーザーが直接入力する情報</h3>
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700 mb-4">
                <li>氏名、ニックネーム、メールアドレス</li>
                <li>転職活動に関するメモ、記録、振り返り内容</li>
                <li>音声入力された内容およびその文字起こし</li>
                <li>その他、ユーザーが任意に入力するテキスト情報</li>
              </ul>
              <p className="text-xs text-slate-500 mb-6">※これらの内容には、ユーザーの価値観、思考、感情に関する情報が含まれる場合があります。</p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">(2) 認証・利用に関する情報</h3>
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700 mb-6">
                <li>ログイン情報</li>
                <li>利用日時、操作履歴</li>
                <li>クッキー（Cookie）や類似技術による識別情報</li>
              </ul>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">(3) 技術的情報</h3>
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
                <li>IPアドレス</li>
                <li>ブラウザ情報、端末情報</li>
                <li>エラー情報、パフォーマンス情報</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">2. 利用目的</h2>
              <p className="mb-4 text-slate-700">取得した情報は、以下の目的のために利用します。</p>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>本サービスの提供・運営のため</li>
                <li>ユーザーの入力内容を保存・表示・編集するため</li>
                <li>AIによる文章整形、要約、問いの生成などの補助機能を提供するため</li>
                <li>サービスの改善、品質向上、不具合対応のため</li>
                <li>利用状況の分析、統計データの作成（個人を特定しない形に限ります）</li>
                <li>お問い合わせへの対応のため</li>
                <li>利用規約違反や不正利用への対応のため</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">3. AI機能の利用について</h2>
              <p className="mb-4 text-slate-700">本サービスでは、文章の整形、要約、問いの生成等のために、外部の生成AIサービスを利用する場合があります。</p>
              
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700 mb-6">
                <li>AIは <span className="font-bold text-slate-900">判断・評価・結論をユーザーに代わって行うものではありません</span></li>
                <li>AIは、ユーザーの思考を整理し、問い返すための補助としてのみ利用されます</li>
                <li>ユーザーの入力内容は、AI処理のために一時的に外部サービスへ送信される場合があります</li>
              </ul>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">学習利用について</h3>
              <p className="text-slate-700 mb-4">
                本サービスは、ユーザーの入力内容を <span className="font-bold text-slate-900">AIモデルの学習目的で利用することを意図していません</span>。
                ただし、外部AIサービスの仕様や契約条件に基づく取扱いについては、各提供者のポリシーが適用される場合があります。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">4. 個人情報の第三者提供</h2>
              <p className="mb-4 text-slate-700">本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
              <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                <li>ユーザー本人の同意がある場合</li>
                <li>法令に基づき開示が求められた場合</li>
                <li>人の生命・身体・財産の保護のために必要で、本人の同意を得ることが困難な場合</li>
                <li>サービス提供に必要な範囲で業務委託先に提供する場合（この場合、適切な管理を行います）</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">5. 個人情報の管理</h2>
              <p className="text-slate-700 leading-relaxed">
                本サービスは、個人情報の漏えい、滅失、毀損を防止するため、適切な技術的・組織的安全管理措置を講じます。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">6. 個人情報の開示・訂正・削除</h2>
              <p className="text-slate-700 leading-relaxed">
                ユーザーは、自己の個人情報について、開示、訂正、削除を求めることができます。
                これらの請求があった場合、本人確認のうえ、法令に従い適切に対応します。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">7. クッキー（Cookie）について</h2>
              <p className="text-slate-700 leading-relaxed">
                本サービスでは、利便性向上や利用状況分析のため、クッキー等の技術を使用する場合があります。
                ユーザーはブラウザ設定により、クッキーの利用を制限または無効化することができます。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">8. プライバシーポリシーの変更</h2>
              <p className="text-slate-700 leading-relaxed">
                本ポリシーの内容は、必要に応じて変更されることがあります。
                重要な変更がある場合は、本サービス上での告知等、適切な方法で通知します。
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">9. お問い合わせ</h2>
              <p className="mb-4 text-slate-700">本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。</p>
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
                <li>運営者：Candi運営チーム</li>
                <li>お問い合わせ方法：本サービス内のお問い合わせフォーム、または指定の連絡手段</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">10. 制定日</h2>
              <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
                <li>制定日：2026年01月10日</li>
              </ul>
            </div>
          </section>

          <footer className="mt-20 pt-8 border-t border-slate-100">
            <div className="text-center">
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
