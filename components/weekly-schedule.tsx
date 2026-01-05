"use client"

import { useState } from "react"
import type { Application, GrowthLog } from "@/lib/mock-data"
import { getDisplayCompanyName } from "@/lib/mask-utils"
import { getGrowthLogCategoryLabel } from "@/lib/mock-data"
import { Briefcase, Sprout } from "lucide-react"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

const PHASE_COLORS: Record<string, string> = {
  カジュアル面談: "#4A90E2",
  書類選考: "#4A90E2",
  一次面接: "#7B61FF",
  二次面接: "#A95FFF",
  最終面接: "#D86FFF",
  内定: "#48C774",
  内定受諾: "#48C774",
  オファー面談: "#48C774",
  適性検査: "#4A90E2",
  辞退: "#B0B0B0",
  見送り: "#B0B0B0",
  お見送り: "#B0B0B0",
  その他: "#B0B0B0",
}

function getPhaseColor(eventType: string): string {
  return PHASE_COLORS[eventType] || "#4A90E2"
}

interface WeeklyEvent {
  id: string
  sourceId: string // applicationId or growthLogId
  sourceType: "job" | "growth"
  date: string
  startTime: string
  endTime: string
  title: string // company name or growth log title
  subtitle: string // position or category
  eventType: string // interview type or growth log type
  position?: string
}

function getEventsFromApplications(applications: Application[]): WeeklyEvent[] {
  const events: WeeklyEvent[] = []

  applications.forEach((app) => {
    app.events.forEach((event) => {
      events.push({
        id: event.id,
        sourceId: app.id,
        sourceType: "job",
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        title: app.company,
        subtitle: app.position,
        eventType: event.type,
        position: app.position,
      })
    })
  })

  return events
}

function getEventsFromGrowthLogs(growthLogs: GrowthLog[]): WeeklyEvent[] {
  return growthLogs.map((log) => ({
    id: log.id,
    sourceId: log.id,
    sourceType: "growth",
    date: log.date,
    startTime: log.startTime,
    endTime: log.endTime,
    title: log.title,
    subtitle: getGrowthLogCategoryLabel(log.category),
    eventType: log.type,
  }))
}

function formatDate(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}/${day}(${weekday})`
}

function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

function formatTimeRange(startTime: string, endTime: string): string {
  if (startTime === '00:00' || !startTime) return ""
  return `${startTime}〜${endTime}`
}

interface WeeklyScheduleProps {
  isMasked: boolean
  onEventClick?: (applicationId: string) => void
  applications: Application[]
  growthLogs: GrowthLog[]
}

type EventFilter = "all" | "job" | "growth"

export function WeeklySchedule({ isMasked, onEventClick, applications, growthLogs }: WeeklyScheduleProps) {
  // <CHANGE> Use today as default baseDate
  const [baseDate, setBaseDate] = useState(new Date())
  
  // <CHANGE> Calculate weekDays based on baseDate
  const weekDays = getWeekDays(baseDate)

  const jobEvents = getEventsFromApplications(applications)
  const growthEvents = getEventsFromGrowthLogs(growthLogs)
  const allEvents = [...jobEvents, ...growthEvents]

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [eventFilter, setEventFilter] = useState<EventFilter>("all")

  // <CHANGE> Filter events to show only those within the current week range
  const weekStartISO = formatDateISO(weekDays[0])
  const weekEndISO = formatDateISO(weekDays[6])

  const filteredEvents = allEvents.filter((event) => {
    // Date range filter
    if (event.date < weekStartISO || event.date > weekEndISO) return false

    // Type filter
    if (eventFilter === "all") return true
    return event.sourceType === eventFilter
  })

  const jobEventsCount = filteredEvents.filter(e => e.sourceType === "job").length
  const growthEventsCount = filteredEvents.filter(e => e.sourceType === "growth").length

  const handleEventClick = (event: WeeklyEvent) => {
    // Only trigger click for job events
    if (event.sourceType === "job" && onEventClick) {
      onEventClick(event.sourceId)
    }
  }

  const toggleDay = (dateISO: string) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dateISO)) {
        newSet.delete(dateISO)
      } else {
        newSet.add(dateISO)
      }
      return newSet
    })
  }
  
  // <CHANGE> Navigation handlers
  const handlePrevWeek = () => {
    setBaseDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const handleNextWeek = () => {
    setBaseDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }
  
  const handleToday = () => {
    setBaseDate(new Date())
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">今週の予定</h2>
          <div className="flex items-center rounded-lg bg-white border border-[#E5E7EB] p-0.5 shadow-sm">
             <button 
               onClick={handlePrevWeek}
               className="p-1 hover:bg-[#F3F4F6] rounded text-[#6B7280]"
               aria-label="前の週"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <button 
               onClick={handleToday}
               className="px-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F3F4F6] rounded py-1"
             >
               今日
             </button>
             <button 
               onClick={handleNextWeek}
               className="p-1 hover:bg-[#F3F4F6] rounded text-[#6B7280]"
               aria-label="次の週"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
             </button>
          </div>
        </div>
{/* <CHANGE> Hidden filtering buttons for now
        <div className="flex gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setEventFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              eventFilter === "all"
                ? "bg-[#3B82F6] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setEventFilter("job")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              eventFilter === "job"
                ? "bg-[#3B82F6] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
            }`}
          >
            転職活動
          </button>
          <button
            onClick={() => setEventFilter("growth")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              eventFilter === "growth"
                ? "bg-[#3B82F6] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
            }`}
          >
            成長ログ
          </button>
        </div>
        */}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:overflow-x-visible md:pb-0">
        {weekDays.map((day) => {
          const dateISO = formatDateISO(day)
          const dayEvents = filteredEvents
            .filter((e) => e.date === dateISO)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))

          const isExpanded = expandedDays.has(dateISO)
          const hasMoreThan2Events = dayEvents.length > 2
          const displayEvents = isExpanded ? dayEvents : dayEvents.slice(0, 2)
          const remainingCount = dayEvents.length - 2
          const eventCount = dayEvents.length

          const isToday = formatDateISO(new Date()) === dateISO

          return (
            <div
              key={dateISO}
              className={`min-w-[140px] flex-shrink-0 rounded-[14px] border ${
                isToday ? "border-[#3B82F6] ring-1 ring-[#3B82F6]" : "border-[#E5E7EB]"
              } bg-white px-3 py-3 shadow-sm md:min-w-0 md:flex-shrink flex flex-col ${
                isExpanded ? "min-h-[200px]" : "h-[200px]"
              }`}
            >
              <div className="mb-2 border-b border-[#E5E7EB] pb-2 flex items-center justify-between flex-shrink-0">
                <span className={`text-xs font-medium ${isToday ? "text-[#3B82F6]" : "text-[#555]"}`}>
                  {formatDate(day)}
                </span>
                {eventCount > 0 && (
                  <span className="text-[10px] font-medium text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full">
                    {eventCount}件
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {dayEvents.length === 0 ? (
                  <p className="py-1 text-xs text-[#A1A1AA]">予定なし</p>
                ) : (
                  <div className="space-y-2 h-full">
                    {displayEvents.map((event, idx) => {
                      const isGrowth = event.sourceType === "growth"
                      const dotColor = isGrowth ? "#22C55E" : getPhaseColor(event.eventType)

                      return (
                        <div
                          key={event.id}
                          className={idx < displayEvents.length - 1 ? "border-b border-[#E5E7EB] pb-2" : ""}
                        >
                          <button
                            onClick={() => handleEventClick(event)}
                            className={`w-full text-left transition-all duration-150 rounded-lg px-1.5 py-1 -mx-1.5 -my-1 ${
                              event.sourceType === "job"
                                ? "cursor-pointer hover:bg-[#F5F6F8] active:scale-[0.98]"
                                : "cursor-default"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                style={{ backgroundColor: dotColor }}
                              >
                                {isGrowth ? (
                                  <Sprout className="h-2.5 w-2.5 text-white" />
                                ) : (
                                  <Briefcase className="h-2.5 w-2.5 text-white" />
                                )}
                              </span>
                              <span className="text-xs font-semibold text-[#111827] truncate">
                                {isGrowth ? event.title : getDisplayCompanyName(event.title, isMasked)}
                              </span>
                            </div>
                            <p className="ml-6 text-[10px] text-[#6B7280] truncate mt-0.5">{event.subtitle}</p>
                            <p className="ml-6 text-[10px] truncate" style={{ color: dotColor }}>
                              {event.eventType}
                            </p>
                            {event.startTime && event.endTime && (
                              <p className="ml-6 text-[10px] text-[#9CA3AF] leading-tight mt-0.5">
                                {formatTimeRange(event.startTime, event.endTime)}
                              </p>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {hasMoreThan2Events && (
                <div className="flex-shrink-0 pt-2 border-t border-[#E5E7EB] mt-auto">
                  <button
                    onClick={() => toggleDay(dateISO)}
                    className="text-xs text-[#2F80ED] hover:text-blue-700 font-medium transition-colors duration-150"
                  >
                    {isExpanded ? "閉じる" : `他${remainingCount}件`}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 text-center text-xs text-[#6B7280]">
        この期間の転職活動：{jobEventsCount}件
      </div>
    </div>
  )
}
