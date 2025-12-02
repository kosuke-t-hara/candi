"use client"

import { MaskToggle } from "./mask-toggle"
import { Tag } from "./ui/tag"

interface CandidateSummaryProps {
  isMasked: boolean
  onToggleMask: () => void
}

export function CandidateSummary({ isMasked, onToggleMask }: CandidateSummaryProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] px-4 py-4 md:px-8 md:py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] tracking-[0.25px]">{"那須　与一"}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#1F2937]">
            <span className="tracking-[0.25px]">希望年収 900〜1200万円</span>
            <Tag variant="success">応募中の案件 7</Tag>
            <Tag variant="primary">今週の面接 3</Tag>
          </div>
        </div>
        <MaskToggle isMasked={isMasked} onToggle={onToggleMask} />
      </div>
    </section>
  )
}
