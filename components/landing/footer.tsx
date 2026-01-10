import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-accent px-5 py-12 text-accent-foreground md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-lg font-semibold">Candi</span>

          <p className="mt-4 text-sm text-accent-foreground/60">転職活動を、もっとシンプルに、もっと深く。</p>

          <div className="mt-5">
            <Button
              asChild
              className="h-12 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/candi">Candiを使ってみる</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-accent-foreground/60">
            <Link href="/terms/candi" className="transition-colors hover:text-accent-foreground/80">
              利用規約
            </Link>
            <span>|</span>
            <Link href="/privacy" className="transition-colors hover:text-accent-foreground/80">
              プライバシーポリシー
            </Link>
          </div>

          <p className="mt-6 text-xs text-accent-foreground/50">{"© 2025 Candi. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}
