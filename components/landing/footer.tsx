import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-accent px-5 py-16 text-accent-foreground md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold tracking-tight">Candi🍬</span>

          <p className="mt-6 text-base text-accent-foreground/60 max-w-sm">
            転職活動を、結果だけでなく
            <br />
            「自分自身の納得」を深める時間に。
          </p>

          <div className="mt-10">
            <Button
              asChild
              className="h-14 rounded-full bg-primary px-10 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Link href="/candi">Candiを使ってみる</Link>
            </Button>
          </div>

          <div className="mt-20 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-accent-foreground/60">
            <Link href="/terms/candi" className="transition-colors hover:text-accent-foreground/80">
              Candi 利用規約
            </Link>
            <Link href="/privacy/candi" className="transition-colors hover:text-accent-foreground/80">
              プライバシーポリシー
            </Link>
            <Link href="/lp/candi/story" className="transition-colors hover:text-accent-foreground/80">
              Candiの考え方
            </Link>
            <Link href="/roadmap/candi" className="transition-colors hover:text-accent-foreground/80">
              開発ロードマップ
            </Link>
          </div>

          <p className="mt-12 text-xs text-accent-foreground/40 font-mono tracking-widest uppercase">
            {"© 2026 Candi by Toro"}
          </p>
        </div>
      </div>
    </footer>
  )
}
