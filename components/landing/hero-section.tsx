import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-accent text-accent-foreground">
      <div className="px-5 py-4 md:px-8">
        <span className="text-lg font-semibold tracking-tight">Candi</span>
      </div>

      <div className="px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            転職活動を、
            <br />
            ひとつの場所に集約する。
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-accent-foreground/80 md:text-lg">
            応募状況、選考予定、関連URL、そして日々の思考。
            <br className="hidden md:inline" />
            散らばりやすい情報を、Candi が一箇所に整えます。
          </p>

          <p className="mt-4 text-sm text-accent-foreground/60 md:text-base">
            情報の整理に追われることなく、次のキャリアに向き合うために。
          </p>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/candi">Candiを開く</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
