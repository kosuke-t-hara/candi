"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SortControls } from "./sort-controls"
import { SelectionIndicator } from "./selection-indicator"
import type { Application } from "@/lib/mock-data"
import { getDisplayCompanyName, getDisplaySourceLabel, getSourceTypeLabel, getDisplayMemo } from "@/lib/mask-utils"
import { sortApplications, type SortMode, type SortDirection } from "@/lib/sort-utils"
import { getStageLabel, getDisplayEventLabel, getDisplayStatus } from "@/lib/selection-phase-utils"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

function formatDateDisplay(isoDate: string): string {
  const date = new Date(isoDate)
  if (!isoDate || isNaN(date.getTime())) return "—"
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}/${day}（${weekday}）`
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}〜${endTime}`
}

interface ApplicationTableProps {
  isMasked: boolean
  sortMode: SortMode
  sortDirection: SortDirection
  onSortModeChange: (mode: SortMode) => void
  onSortDirectionToggle: () => void
  onApplicationClick: (applicationId: string) => void
  onAddClick: () => void
  applications: Application[] // Added applications prop
}

export function ApplicationTable({
  isMasked,
  sortMode,
  sortDirection,
  onSortModeChange,
  onSortDirectionToggle,
  onApplicationClick,
  onAddClick,
  applications,
}: ApplicationTableProps) {
  const sortedApplications = sortApplications(applications, sortMode, sortDirection)

  return (
    <div className="hidden md:block">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">進行中の応募 {sortedApplications.length}件</h2>
          <SortControls
            sortMode={sortMode}
            sortDirection={sortDirection}
            onSortModeChange={onSortModeChange}
            onSortDirectionToggle={onSortDirectionToggle}
          />
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 text-sm font-medium text-[#2F80ED] hover:text-blue-700 transition-colors pb-1"
        >
          <span className="text-lg">+</span> 応募を追加
        </button>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A1A1A] text-left text-sm text-white">
              <th className="px-4 py-3 font-medium min-w-[200px] w-1/4">企業</th>
              <th className="px-4 py-3 font-medium min-w-[120px]">紹介元</th>
              <th className="px-4 py-3 font-medium min-w-[80px]">状況</th>
              <th className="px-4 py-3 font-medium">メモ</th>
            </tr>
          </thead>
          <AnimatePresence mode="popLayout">
            <tbody>
              {sortedApplications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  data-app-id={app.id}
                  onClick={() => onApplicationClick(app.id)}
                  className={`border-b border-[#E5E7EB] text-sm transition-all hover:bg-[#F5F6F8] hover:shadow-md cursor-pointer active:scale-[0.99] ${
                    index === sortedApplications.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#1A1A1A] whitespace-nowrap">{getDisplayCompanyName(app.company, isMasked)}</div>
                    <div className="text-xs text-[#6B7280] whitespace-nowrap">{app.position}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <SelectionIndicator phase={app.selectionPhase} isArchived={app.applicationStatus === "closed"} />
                      <span className="text-xs text-[#6B7280]" suppressHydrationWarning>{getDisplayEventLabel(app.events, app.stage)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#555]">
                      {getSourceTypeLabel(app.sourceType)}
                    </span>
                    {app.sourceLabel && (
                      <div className="text-xs text-[#6B7280] mt-1">
                        {getDisplaySourceLabel(app.sourceType, app.sourceLabel, isMasked)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const { label, color } = getDisplayStatus(app)
                      return (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            color === "gray"
                              ? "bg-[#F3F4F6] text-[#A1A1AA]"
                              : color === "green"
                                ? "bg-[#E7F8ED] text-[#34A853]"
                                : color === "yellow"
                                  ? "bg-[#FFF7DA] text-[#E6B400]"
                                  : color === "red"
                                    ? "bg-[#FFEBEE] text-[#E57373]"
                                    : "bg-[#F3F4F6] text-[#A1A1AA]"
                          }`}
                        >
                          {label}
                        </span>
                      )
                    })()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-sm text-[#333] line-clamp-2">{getDisplayMemo(app.memo, isMasked)}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  )
}
