"use client"

import { ArrowLeft, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DailyQuestionPage() {
  const [answer, setAnswer] = useState("")
  const router = useRouter()

  const handleSubmit = () => {
    // Save answer logic would go here
    router.push("/daily-question/success")
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-medium tracking-[0.25px]">今日の1問</h1>
          <button className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Question Card */}
        <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] px-5 py-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-2 tracking-[0.25px]">今日の1問</h2>
            <p className="text-xs text-[#6B7280] tracking-[0.25px]">あなたの価値観を整理するための1問です</p>
          </div>
          <p className="text-base font-semibold text-[#1F2937] leading-relaxed tracking-[0.25px]">
            最近、成長を実感した瞬間はありましたか？
          </p>
        </section>

        {/* Answer Area */}
        <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] px-5 py-6 mb-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="自由に書いてみてください…"
            className="w-full h-[160px] resize-none border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent tracking-[0.25px]"
          />
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] font-medium rounded-xl py-6"
            >
              スキップ
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="flex-1 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-medium rounded-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            回答する
          </Button>
        </div>
      </div>
    </div>
  )
}
