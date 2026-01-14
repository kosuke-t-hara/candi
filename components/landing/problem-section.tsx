import { Minus } from "lucide-react"

const problems = [
  {
    text: "条件は整理できる。でも、なぜそれを選ぶのかは言葉にならない。",
  },
  {
    text: "面談後の感触や違和感は、すぐに薄れてしまう。",
  },
  {
    text: "選考が進むにつれ、自分の判断基準がどこにあったのか見失いそうになる。",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-background px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl leading-tight">
          転職活動は、情報よりも
          <br />
          「判断」が難しい。
        </h2>

        <div className="mt-16 space-y-12">
          <div className="flex items-start gap-6 pl-4 md:pl-8 border-l-2 border-muted">
            <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
              条件は揃っている。<br />
              でも、なぜそれを選ぶのかが言葉にならない。
            </p>
          </div>
          <div className="flex items-start gap-6 pl-4 md:pl-8 border-l-2 border-muted">
            <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
              面談のあとに感じた違和感も、<br />
              数日経つと消えてしまう。
            </p>
          </div>
          <div className="flex items-start gap-6 pl-4 md:pl-8 border-l-2 border-muted">
            <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
              判断の途中にあった「考え」が、<br />
              どこにも残らないまま次に進んでしまうから。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
