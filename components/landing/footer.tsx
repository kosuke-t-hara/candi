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

          <div className="mt-16 bg-accent-foreground/5 py-8 px-6 rounded-2xl max-w-sm w-full border border-accent-foreground/5">
            <h4 className="text-sm font-bold text-accent-foreground/80 mb-3">ひっそり聞いてみたい方へ</h4>
            <p className="text-sm text-accent-foreground/60 leading-relaxed mb-4 text-pretty">
              転職活動の性質上、
              <br />
              公開したくない質問もあると思います。
              <br className="hidden md:inline" />
              Candiでは、ログインせず、匿名でも
              <br />
              ご相談いただけます。
            </p>
            <a 
              href="mailto:withtoro.app@gmail.com" 
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-foreground/70 hover:text-accent-foreground/90 transition-colors underline decoration-accent-foreground/20 underline-offset-4 hover:decoration-accent-foreground/40"
            >
              📩 withtoro.app@gmail.com
              <span className="text-xs opacity-70 font-normal no-underline">（短文・一言だけでもOK）</span>
            </a>
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
