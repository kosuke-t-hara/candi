import { ClipboardList, CalendarDays, Link2 } from "lucide-react"

const features = [
  {
    icon: ClipboardList,
    title: "選考ステータスの可視化",
    subtitle: "「今、どこまで進んでいるか」を迷わない",
    items: ["応募から内定受諾まで、あらゆるフェーズに対応", "各企業の選考状況を一覧でスマートに把握"],
  },
  {
    icon: CalendarDays,
    title: "スケジュールの一元管理",
    subtitle: "日程やアクセス先を探す手間を排する",
    items: ["面接・面談の日時と目的をセットで記録", "確定前でも候補日を一時保存可能"],
  },
  {
    icon: Link2,
    title: "関連情報のアーカイブ",
    subtitle: "必要なリソースへ、即座にアクセス",
    items: ["求人詳細、Web面接URL、提出資料を紐付け", "散らばりがちな情報を「応募」という単位で集約"],
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">主な機能</h2>

        <p className="mt-3 text-sm text-muted-foreground">複数の選考を、一つのプラットフォームで最適化します。</p>

        <div className="mt-10 space-y-10">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground">{feature.title}</h3>
                <p className="mt-1 text-sm text-primary/80">{feature.subtitle}</p>
                <ul className="mt-2 space-y-1">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
