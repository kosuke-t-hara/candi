import { AlertCircle, Calendar, FileText, Brain } from "lucide-react"

const problems = [
  {
    icon: AlertCircle,
    text: "求人媒体やエージェントごとに、応募状況が追い切れない",
  },
  {
    icon: Calendar,
    text: "面接の日程や会議URLが、メールやカレンダーに散乱している",
  },
  {
    icon: FileText,
    text: "選考の振り返りやメモが、どこにあるか分からない",
  },
  {
    icon: Brain,
    text: "選考が進むにつれ、情報の整理だけで頭が疲弊していく",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-background px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">よくある課題</h2>

        <ul className="mt-8 space-y-5">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-start gap-4">
              <problem.icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <span className="text-base leading-relaxed text-foreground/90">{problem.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
