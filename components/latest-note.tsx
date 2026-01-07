"use client"

import { useState } from "react"

interface LatestNoteProps {
  content: string
  createdAt: string
}

export function LatestNote({ content, createdAt }: LatestNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const lineCount = content.split('\n').length
  const shouldShowToggle = lineCount > 4

  return (
    <div className="mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] px-6 py-6 md:px-10 md:py-8 shadow-sm group">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#2F80ED] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-bold tracking-wider text-[#2F80ED] uppercase">最新のひとこと</span>
            <div className="h-[1px] flex-1 bg-[#2F80ED] opacity-10" />
          </div>
          <p 
            className={`text-base md:text-base font-light text-[#1F2937] leading-relaxed italic whitespace-pre-wrap transition-all duration-300 ${
              !isExpanded && shouldShowToggle ? 'line-clamp-4' : ''
            }`}
          >
            {content}
          </p>
          {shouldShowToggle && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm text-[#2F80ED] hover:text-[#1E5FBD] font-medium transition-colors"
            >
              {isExpanded ? '閉じる' : 'もっと見る'}
            </button>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF] font-medium">
              {new Date(createdAt).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
            </span>
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] opacity-20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] opacity-40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
