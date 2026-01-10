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
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
          転職活動は、情報よりも
          <br />
          「判断」が難しい。
        </h2>

        <div className="mt-16 space-y-12">
          {problems.map((problem, index) => (
            <div key={index} className="flex items-start gap-6 border-l-2 border-muted pl-8 transition-colors hover:border-primary/40">
              <span className="text-lg leading-relaxed text-foreground/80 md:text-xl">
                {problem.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
