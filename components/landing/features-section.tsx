import { ClipboardList, CalendarDays, Archive } from "lucide-react"

const features = [
  {
    icon: ClipboardList,
    title: "応募をひとつにまとめる",
    description: "複数の媒体やエージェントを使っていても、選考ステータスを一目で見渡せます。",
  },
  {
    icon: CalendarDays,
    title: "予定を迷わせない",
    description: "面談の日時、会議URL、目的をセットで管理。直前になって探す手間をなくします。",
  },
  {
    icon: Archive,
    title: "思考をアーカイブする",
    description: "選考ごとのメモや提出資料、ふとした気づきを、企業ごとに紐付けて残せます。",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
          だから、続けられます。
        </h2>

        <div className="mt-16 space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-sm transition-all group-hover:border-primary/20">
                <feature.icon className="size-6 text-primary/80" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
