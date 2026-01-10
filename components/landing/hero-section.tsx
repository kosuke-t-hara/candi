import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-accent text-accent-foreground flex min-h-[90vh] flex-col">
      <header className="px-5 py-6 md:px-8">
        <span className="text-xl font-bold tracking-tight">Candi🍬</span>
      </header>

      <div className="flex flex-1 items-center px-5 pb-24 pt-12 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-7xl">
            転職の結果ではなく、
            <br />
            あなたの「選び方」を残す。
          </h1>

          <div className="mt-8 max-w-xl">
            <p className="text-pretty text-lg leading-relaxed text-accent-foreground/90 md:text-xl lg:text-2xl">
              応募、面談、迷い、問い。
              <br />
              散らばりがちな思考をひとつに集め、
              <br className="hidden md:inline" />
              あとから振り返れる「判断の履歴」にします。
            </p>
          </div>

          <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-primary px-10 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Link href="/candi">Candiを使ってみる</Link>
            </Button>
            
            <Link 
              href="#after" 
              className="text-base text-accent-foreground/60 hover:text-accent-foreground/80 transition-colors underline underline-offset-4 decoration-accent-foreground/20 hover:decoration-accent-foreground/40"
            >
              転職が終わったあと、何が残るか
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
