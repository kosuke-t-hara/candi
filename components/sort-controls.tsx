"use client"

import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { SortMode, SortDirection } from "@/lib/sort-utils"

interface SortControlsProps {
  sortMode: SortMode
  sortDirection: SortDirection
  onSortModeChange: (mode: SortMode) => void
  onSortDirectionToggle: () => void
}

export function SortControls({ sortMode, sortDirection, onSortModeChange, onSortDirectionToggle }: SortControlsProps) {
  const handleSortableClick = (mode: "nextEvent" | "stage") => {
    if (sortMode === mode) {
      onSortDirectionToggle()
    } else {
      onSortModeChange(mode)
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="text-xs text-[#555]">並び替え：</span>
      <button
        onClick={() => handleSortableClick("nextEvent")}
        className={cn(
          "rounded-full px-3 py-1 text-xs border transition-colors duration-150 flex items-center gap-1",
          sortMode === "nextEvent"
            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
            : "bg-white text-[#555] border-[#E5E7EB] hover:border-[#A1A1AA]",
        )}
      >
        イベント順
        {sortMode === "nextEvent" &&
          (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
      <button
        onClick={() => handleSortableClick("stage")}
        className={cn(
          "rounded-full px-3 py-1 text-xs border transition-colors duration-150 flex items-center gap-1",
          sortMode === "stage"
            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
            : "bg-white text-[#555] border-[#E5E7EB] hover:border-[#A1A1AA]",
        )}
      >
        フェーズ順
        {sortMode === "stage" &&
          (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
      <button
        onClick={() => onSortModeChange("archived")}
        className={cn(
          "rounded-full px-3 py-1 text-xs border transition-colors duration-150",
          sortMode === "archived"
            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
            : "bg-white text-[#555] border-[#E5E7EB] hover:border-[#A1A1AA]",
        )}
      >
        終了済み
      </button>
    </div>
  )
}
