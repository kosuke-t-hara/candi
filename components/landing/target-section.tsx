import { Check } from "lucide-react"

const targets = [
  "複数の選考を並行して進めている",
  "煩雑な情報整理の負荷を軽減したい",
  "選考のプロセスを大切に、丁寧に振り返りたい",
  "次のアクションに向けた思考を、一箇所にまとめたい",
]

export function TargetSection() {
  return (
    <section className="bg-secondary px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">こんな人に向いています</h2>

        <ul className="mt-8 space-y-4">
          {targets.map((target, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="size-5 shrink-0 text-primary" />
              <span className="text-base text-foreground/90">{target}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
