"use client"

import { Eye, EyeOff } from "lucide-react"

interface MaskToggleProps {
  isMasked: boolean
  onToggle: () => void
}

export function MaskToggle({ isMasked, onToggle }: MaskToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors"
        title={isMasked ? "マスク解除（詳細表示）" : "マスク有効化"}
        aria-label={isMasked ? "マスク解除" : "マスク有効化"}
      >
        {isMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
        β
      </span>
    </div>
  )
}
