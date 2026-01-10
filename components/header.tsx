"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Menu, LogOut, BookOpen } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/lp/candi")
    router.refresh()
  }

  return (
    <header className="bg-[#222222]/95 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 w-full">
      <div className="mx-auto w-full px-2 h-14 flex items-center">
        <div className="relative flex items-center justify-between w-full h-full">
          {/* Left: Menu Trigger */}
          <div className="flex items-center">
            <Sheet modal={false}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#2A2A2A] border-white/10 text-white p-0 flex flex-col w-[280px]">
                <SheetHeader className="p-6 border-b border-white/5">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="candyGradientMenu" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF8FB4" />
                          <stop offset="50%" stopColor="#FF6AA2" />
                          <stop offset="100%" stopColor="#FFB3CE" />
                        </linearGradient>
                      </defs>
                      <circle cx="14" cy="11" r="9" fill="url(#candyGradientMenu)" />
                      <ellipse cx="11" cy="8" rx="2.5" ry="2" fill="white" fillOpacity="0.4" />
                      <rect x="12.5" y="18" width="3" height="8" rx="1.5" fill="#FFB3CE" />
                    </svg>
                    <span>Candi メニュー</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 px-3 py-6 space-y-2">
                  <Link
                    href="/past?type=hitokoto&from=candi"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Toro</span>
                  </Link>
                </div>

                <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] mt-auto border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-all font-medium group/logout"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover/logout:text-white/60 transition-colors">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span>ログアウト</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Service Name */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none sm:pointer-events-auto">
            <Link href="/candi" className="flex items-center gap-2 no-underline group">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <defs>
                  <linearGradient id="candyGradientTitle" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8FB4" />
                    <stop offset="50%" stopColor="#FF6AA2" />
                    <stop offset="100%" stopColor="#FFB3CE" />
                  </linearGradient>
                </defs>
                <circle cx="14" cy="11" r="9" fill="url(#candyGradientTitle)" />
                <ellipse cx="11" cy="8" rx="2.5" ry="2" fill="white" fillOpacity="0.4" />
                <rect x="12.5" y="18" width="3" height="8" rx="1.5" fill="#FFB3CE" />
              </svg>
              <h1 className="text-xl font-bold text-white mb-0">Candi</h1>
            </Link>
          </div>

          {/* Right: Spacer for balance */}
          <div className="w-10" />
        </div>
      </div>
    </header>
  )
}
