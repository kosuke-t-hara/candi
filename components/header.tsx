"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="bg-[#1A1A1A] px-4 py-3">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="candyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8FB4" />
                  <stop offset="50%" stopColor="#FF6AA2" />
                  <stop offset="100%" stopColor="#FFB3CE" />
                </linearGradient>
              </defs>
              {/* Candy body */}
              <circle cx="14" cy="11" r="9" fill="url(#candyGradient)" />
              {/* Highlight */}
              <ellipse cx="11" cy="8" rx="2.5" ry="2" fill="white" fillOpacity="0.4" />
              {/* Stick */}
              <rect x="12.5" y="18" width="3" height="8" rx="1.5" fill="#FFB3CE" />
            </svg>
            <h1 className="text-xl font-bold text-white">Candi</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/career-os"
              className="flex items-center gap-1.5 rounded-lg bg-[#F3F4F6]/10 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#F3F4F6]/20"
            >
              <span>🧭</span>
              <span className="hidden sm:inline">キャリアOS</span>
            </Link>
            <Link
              href="/values-map"
              className="flex items-center gap-1.5 rounded-lg bg-[#F3F4F6]/10 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#F3F4F6]/20"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">価値観マップ</span>
            </Link>
            <Link
              href="/ai-hearing"
              className="flex items-center gap-1.5 rounded-lg bg-[#F3F4F6]/10 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#F3F4F6]/20"
            >
              <span>🎤</span>
              <span className="hidden sm:inline">AIヒアリング</span>
            </Link>
            <Link
              href="/agents"
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              <span>👔</span>
              <span className="hidden sm:inline">Agent Preview</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
