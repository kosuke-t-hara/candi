"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SortControls } from "./sort-controls"
import { SelectionIndicator } from "./selection-indicator"
import type { Application } from "@/lib/mock-data"
import { getDisplayCompanyName, getDisplaySourceLabel, getSourceTypeLabel } from "@/lib/mask-utils"
import { sortApplications, type SortMode, type SortDirection } from "@/lib/sort-utils"

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
  applications: Application[] // Added applications prop
}

export function ApplicationTable({
  isMasked,
  sortMode,
  sortDirection,
  onSortModeChange,
  onSortDirectionToggle,
  onApplicationClick,
  applications, // Added applications parameter
}: ApplicationTableProps) {
  const sortedApplications = sortApplications(applications, sortMode, sortDirection)

  return (
    <div className="hidden md:block">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">進行中の応募 {sortedApplications.length}件</h2>
        <SortControls
          sortMode={sortMode}
          sortDirection={sortDirection}
          onSortModeChange={onSortModeChange}
          onSortDirectionToggle={onSortDirectionToggle}
        />
      </div>
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A1A1A] text-left text-sm text-white">
              <th className="px-4 py-3 font-medium">企業</th>
              <th className="px-4 py-3 font-medium">紹介元</th>
              <th className="px-4 py-3 font-medium">ステージ</th>
              <th className="px-4 py-3 font-medium">状況</th>
              <th className="px-4 py-3 font-medium">次の予定</th>
              <th className="px-4 py-3 font-medium">アクション / メモ</th>
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
                    <div className="mt-2">
                      <SelectionIndicator phase={app.selectionPhase} />
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
                    <span className="inline-block rounded-full bg-[#E8F1FF] px-2.5 py-0.5 text-xs font-medium text-[#2F80ED]">
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        app.status === "確定"
                          ? "bg-[#E7F8ED] text-[#34A853]"
                          : app.status === "相手ボール"
                            ? "bg-[#FFF7DA] text-[#E6B400]"
                            : app.status === "落選"
                              ? "bg-[#FFEBEE] text-[#E57373]"
                              : "bg-[#F3F4F6] text-[#A1A1AA]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#333]">{formatDateDisplay(app.scheduledDate)}</div>
                    {app.startTime && app.endTime ? (
                      <div className="text-xs text-[#6B7280]">{formatTimeRange(app.startTime, app.endTime)}</div>
                    ) : (
                      <div className="text-xs text-[#A1A1AA]">—</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {app.nextAction && app.nextAction !== "なし" && (
                      <div className="text-sm text-[#333]">{app.nextAction}</div>
                    )}
                    {app.memo && app.memo !== "ー" && <div className="text-xs text-[#6B7280]">メモ：{app.memo}</div>}
                    {(!app.nextAction || app.nextAction === "なし") && (!app.memo || app.memo === "ー") && (
                      <span className="text-xs text-[#A1A1AA]">—</span>
                    )}
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
