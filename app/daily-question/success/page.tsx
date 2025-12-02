"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DailyQuestionSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white sticky top-0 z-10">
        <div className="flex items-center justify-center px-4 py-3">
          <h1 className="text-base font-medium tracking-[0.25px]">今日の1問</h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-12 max-w-md mx-auto flex items-center justify-center min-h-[calc(100vh-56px)]">
        <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] px-6 py-12 text-center w-full">
          {/* Success Icon */}
          <div className="mb-6">
            <span className="text-5xl">✨</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-[#1F2937] mb-4 tracking-[0.25px]">回答を記録しました</h2>

          {/* Description */}
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8 tracking-[0.25px]">
            あなたの価値観マップに反映されました。
            <br />
            続けて内省していくと、より精度が高まります。
          </p>

          {/* CTA Button */}
          <Link href="/values-map">
            <Button className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB] font-medium rounded-xl py-6">
              価値観マップを見る
            </Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
