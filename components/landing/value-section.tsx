import { MessageSquareText, RefreshCw, HelpCircle } from "lucide-react"

const values = [
  {
    icon: MessageSquareText,
    title: "整える",
    description: "話し言葉を、読みやすく整えます（内容は変えません）",
  },
  {
    icon: RefreshCw,
    title: "言い換える",
    description: "書いている内容を、短く映し返します",
  },
  {
    icon: HelpCircle,
    title: "問いを返す",
    description: "自分では気づかなかった前提に、そっと問いを置きます",
  },
]

export function ValueSection() {
  return (
    <section className="bg-secondary px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl text-center">
          考えを、判断に変えるために。
        </h2>
        
        <p className="mt-6 text-center text-lg text-muted-foreground/80">
          ここまでで、<br className="md:hidden" />
          あなた自身の問いを、すでに1つ持っています。
        </p>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-background shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1">
                <value.icon className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-[240px]">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-muted/20 text-center">
          <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
            ここまで読んで、
            <br />
            「自分の場合はどうなんだろう」と思った方へ。
          </p>
          <p className="text-base text-muted-foreground/80 leading-relaxed max-w-lg mx-auto">
            転職活動の内容でも、
            <br className="md:hidden" />
            プロダクトの使い方でも構いません。
            <br /><br />
            表に出ない形でお話できます。
          </p>
          <div className="mt-6">
            <a 
              href="mailto:withtoro.app@gmail.com" 
              className="inline-flex items-center gap-2 text-base font-medium text-foreground/80 hover:text-foreground transition-colors underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground/40"
            >
              <span className="text-lg">📩</span> withtoro.app@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
