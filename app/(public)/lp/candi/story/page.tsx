import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CandiStoryPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-stone-800 font-lp-sans selection:bg-stone-200">
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-8 md:py-32">
        
        {/* ① Before｜転職を始めた頃 */}
        <section className="mb-32 md:mb-48">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            条件は揃っている。<br />
            でも、なぜか決めきれない。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <p>
              年収、職種、働き方。<br />
              情報は十分に集まっている。<br />
              それなのに、どこか引っかかる。
            </p>
            <blockquote className="pl-4 border-l-2 border-stone-300 italic text-stone-500 py-1">
              本当に大事なものが、言葉になっていない気がした。
            </blockquote>
          </div>
        </section>

        {/* ② 揺れ｜面談を重ねるうちに */}
        <section className="mb-32 md:mb-48">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            面談が終わるたびに、<br />
            気持ちは少しずつ変わっていく。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <p>
              良かった点、違和感。<br />
              なぜか印象に残った一言。<br />
              帰り道に考えていたこと。
            </p>
            <blockquote className="pl-4 border-l-2 border-stone-300 italic text-stone-500 py-1">
              でも、それらは数日経つと薄れてしまう。
            </blockquote>
          </div>
        </section>

        {/* ③ 問い｜Candiとの出会い */}
        <section className="mb-32 md:mb-48">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            考えを書いたら、<br />
            問いが返ってきた。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <p>
              思いつくままに書いたメモ。<br />
              整えられ、言い換えられ。<br />
              そして、問いが置かれる。
            </p>
            
            {/* UIイメージ風のボックス */}
            <div className="my-8 p-6 bg-white rounded-lg shadow-sm w-full max-w-md mx-auto border border-stone-100">
              <p className="text-stone-800 font-medium">
                それが満たされなかったら、<br />
                あなたは何を失いますか？
              </p>
            </div>
          </div>
        </section>

        {/* ④ 判断｜自分の言葉で決める */}
        <section className="mb-32 md:mb-48">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            答えは、外から来なかった。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <p>
              問いに向き合う。<br />
              過去のメモを読み返す。<br />
              自分が何を大切にしてきたかが見えてくる。
            </p>
            <blockquote className="pl-4 border-l-2 border-stone-300 italic text-stone-500 py-1">
              選んだ理由を、<br />
              初めて自分の言葉で説明できた。
            </blockquote>
          </div>
        </section>

        {/* ⑤ After｜転職が終わったあと */}
        <section className="mb-32 md:mb-48">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            転職は終わった。<br />
            でも、何も消えていない。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <ul className="list-none space-y-3 pl-0">
              <li className="flex items-start">
                <span className="mr-3 text-stone-300">•</span>
                あなたが大切にしていたこと
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-stone-300">•</span>
                避けたかった条件
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-stone-300">•</span>
                迷い続けた理由
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-stone-300">•</span>
                最後に納得した決め手
              </li>
            </ul>
            <p className="pt-4 text-stone-500 text-sm md:text-base">
              それは、次の転職のためではない。<br />
              次の意思決定のための記録。
            </p>
          </div>
        </section>

        {/* ⑥ メッセージ｜Candiが残すもの */}
        <section className="mb-32">
          <h2 className="text-2xl font-bold leading-relaxed tracking-tight md:text-3xl text-stone-900">
            Candiは、答えを出しません。
          </h2>
          <div className="mt-8 space-y-6 text-base leading-loose text-stone-600 md:text-lg">
            <p>
              判断を代行しない。<br />
              評価もしない。<br />
              ただ、考えが残るように支える。
            </p>
            <blockquote className="pl-4 border-l-2 border-stone-300 italic text-stone-500 py-1">
              あなたの選び方が、あなたをつくるから。
            </blockquote>
          </div>
        </section>

        {/* CTA（ラスト） */}
        <section className="text-center">
          <h2 className="text-xl font-medium tracking-tight text-stone-800 mb-8">
            あなたの「選び方」を、残しませんか。
          </h2>
          <Button asChild size="lg" className="rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 px-8 py-6 text-base font-medium shadow-none">
            <Link href="/candi">
              Candiを使ってみる
            </Link>
          </Button>
          <div className="mt-12 text-sm text-stone-400">
            <Link href="/lp/candi" className="hover:text-stone-600 transition-colors underline underline-offset-4">
              サービスページへ戻る
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
