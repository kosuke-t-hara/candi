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
  if (!isoDate || isoDate === "undefined" || isoDate === "null") return "—"
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return "—"
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}/${day}（${weekday}）`
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}〜${endTime}`
}

interface ApplicationCardListProps {
  isMasked: boolean
  sortMode: SortMode
  sortDirection: SortDirection
  onSortModeChange: (mode: SortMode) => void
  onSortDirectionToggle: () => void
  onApplicationClick: (applicationId: string) => void
  onAddClick: () => void
  applications: Application[] // Added applications prop
}

export function ApplicationCardList({
  isMasked,
  sortMode,
  sortDirection,
  onSortModeChange,
  onSortDirectionToggle,
  onApplicationClick,
  onAddClick,
  applications,
}: ApplicationCardListProps) {
  const sortedApplications = sortApplications(applications, sortMode, sortDirection)

  return (
    <div className="md:hidden">
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
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {sortedApplications.map((app) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              data-app-id={app.id}
              onClick={() => onApplicationClick(app.id)}
              className="rounded-[16px] border border-[#E5E7EB] bg-white px-5 py-5 shadow-sm cursor-pointer transition-shadow"
            >
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">
                    {getDisplayCompanyName(app.company, isMasked)}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">{app.position}</p>
                </div>

                {/* Pills row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#555]">
                    {getSourceTypeLabel(app.sourceType)}
                  </span>

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
                </div>

                {/* Source label if agent */}
                {app.sourceLabel && (
                  <p className="text-xs text-[#6B7280]">
                    {getDisplaySourceLabel(app.sourceType, app.sourceLabel, isMasked)}
                  </p>
                )}

                {/* Selection Indicator Row */}
                <div className="flex items-center gap-2 py-1">
                  <SelectionIndicator phase={app.selectionPhase} isArchived={app.applicationStatus === "closed"} />
                  <span className="text-xs text-[#6B7280]" suppressHydrationWarning>{getDisplayEventLabel(app.events, app.stage)}</span>
                </div>



                {/* Memo */}
                {app.memo && app.memo !== "ー" && (
                  <div className="text-xs text-[#6B7280] border-t border-[#E5E7EB] pt-3 mt-3 line-clamp-2 leading-relaxed">
                    {getDisplayMemo(app.memo, isMasked)}
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
