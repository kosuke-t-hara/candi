import { CheckCircle2 } from "lucide-react"

const items = [
  "あなたが大切にしていたこと",
  "避けたかった条件",
  "何に迷い、何に納得したか",
  "最後に決めた理由（自分の言葉で）",
]

export function AfterSection() {
  return (
    <section id="after" className="bg-background px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
          転職が終わっても、
          <br />
          残るものがあります。
        </h2>

        <div className="mt-16 bg-accent/5 rounded-3xl p-8 md:p-12 border border-accent/10">
          <ul className="space-y-6">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <CheckCircle2 className="size-6 text-primary/60 shrink-0" />
                <span className="text-lg text-foreground/90 md:text-xl font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-16 pt-8 border-t border-accent/10">
            <p className="text-xl font-bold text-foreground md:text-2xl leading-relaxed">
              次の転職のため？
              <br />
              そうじゃない。次の意思決定のために。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
