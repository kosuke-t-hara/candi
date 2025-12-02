"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DailyQuestionCard() {
  return (
    <Link href="/daily-question">
      <section className="mt-6 rounded-2xl bg-white shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#A5C9F5]" />

        <div className="px-5 py-5 pl-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-semibold text-[#1F2937] tracking-[0.25px]">🧠 今日の1問</h3>
              <p className="text-xs text-[#6B7280] mt-1 tracking-[0.25px]">
                あなたの価値観を毎日少しずつ整理しましょう
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-[#1F2937] leading-relaxed tracking-[0.25px] mb-4">
            最近、成長を実感した瞬間はありましたか？
          </p>
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-[#E9F2FF] text-[#2F80ED] hover:bg-[#D1E7FF] font-medium rounded-full px-4 py-2 text-sm shadow-none"
            >
              答える
            </Button>
          </div>
        </div>
      </section>
    </Link>
  )
}
