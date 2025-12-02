"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { ApplicationEvent, ApplicationEventStatus } from "@/lib/mock-data"

export type EventSheetMode = "add" | "edit"

const EVENT_TYPES = [
  "カジュアル面談",
  "書類選考",
  "一次面接",
  "二次面接",
  "最終面接",
  "オファー面談",
  "その他",
] as const

const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
  }
}

function addMinutesToTime(time: string, minutes: number): string {
  if (!time) return ""
  const [hours, mins] = time.split(":").map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`
}

function roundUpTo15Minutes(): string {
  const now = new Date()
  const minutes = now.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 15) * 15

  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1)
    now.setMinutes(0)
  } else {
    now.setMinutes(roundedMinutes)
  }

  const hours = now.getHours()
  const mins = now.getMinutes()
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

function CustomDatePicker({
  value,
  onChange,
  isOpen,
  onClose,
}: {
  value: string
  onChange: (date: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })

  useEffect(() => {
    if (isOpen && value) {
      setViewDate(new Date(value))
    } else if (isOpen) {
      setViewDate(new Date())
    }
  }, [isOpen, value])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const selectDate = (day: number) => {
    const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    onChange(selectedDate)
    onClose()
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  if (!isOpen) return null

  const days = []
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const isSelected = dateStr === value
    const isToday = dateStr === todayStr
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => selectDate(day)}
        className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
          isSelected
            ? "bg-[#2F80ED] text-white"
            : isToday
              ? "bg-[#E5E7EB] text-[#1A1A1A]"
              : "text-[#333] hover:bg-[#F5F6F8]"
        }`}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-3 w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1 rounded-full hover:bg-[#F5F6F8] transition-colors">
          <ChevronLeft className="h-5 w-5 text-[#6B7280]" />
        </button>
        <span className="text-sm font-semibold text-[#1A1A1A]">
          {year}年{month + 1}月
        </span>
        <button type="button" onClick={nextMonth} className="p-1 rounded-full hover:bg-[#F5F6F8] transition-colors">
          <ChevronRight className="h-5 w-5 text-[#6B7280]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} className="h-8 flex items-center justify-center text-xs text-[#6B7280] font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}

function CustomTimeSelect({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (time: string) => void
  label: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent bg-white appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem",
          paddingRight: "2.5rem",
        }}
      >
        <option value="">選択</option>
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  )
}

interface AddEventBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<ApplicationEvent, "id">) => void
  onDelete?: () => void
  mode?: EventSheetMode
  existingEvent?: ApplicationEvent
}

export function AddEventBottomSheet({
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode = "add",
  existingEvent,
}: AddEventBottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [eventType, setEventType] = useState<string>("カジュアル面談")
  const [status, setStatus] = useState<ApplicationEventStatus>("confirmed")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [endTimeManuallySet, setEndTimeManuallySet] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchOffset, setTouchOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart(touch.clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touch = e.touches[0]
    const diff = touch.clientY - touchStart

    // Only allow downward swipe
    if (diff > 0) {
      setTouchOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    const threshold = 100
    const velocity = touchOffset

    if (velocity > threshold) {
      handleClose()
    } else {
      setTouchOffset(0)
    }

    setTouchStart(null)
    setIsDragging(false)
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10)

      if (mode === "edit" && existingEvent) {
        setEventType(existingEvent.type)
        setStatus(existingEvent.status)
        setDate(existingEvent.date)
        setStartTime(existingEvent.startTime)
        setEndTime(existingEvent.endTime)
        setTitle(existingEvent.title || "")
        setNote(existingEvent.note || "")
        setEndTimeManuallySet(true)
      } else {
        const roundedStart = roundUpTo15Minutes()
        setStartTime(roundedStart)
        const calculatedEnd = addMinutesToTime(roundedStart, 60)
        setEndTime(calculatedEnd)
        setEndTimeManuallySet(false)
      }
    }
  }, [isOpen, mode, existingEvent])

  const handleClose = () => {
    setIsAnimating(false)
    setIsDatePickerOpen(false)
    setTimeout(() => {
      onClose()
      setEventType("カジュアル面談")
      setStatus("confirmed")
      setDate("")
      setStartTime("")
      setEndTime("")
      setTitle("")
      setNote("")
      setEndTimeManuallySet(false)
      setTouchStart(null)
      setTouchOffset(0)
      setIsDragging(false)
    }, 250)
  }

  const handleSave = () => {
    if (!date || !startTime || !endTime) return

    const newEvent: Omit<ApplicationEvent, "id"> = {
      type: eventType,
      status,
      date,
      startTime,
      endTime,
      title: title || undefined,
      note,
    }

    onSave(newEvent)
    handleClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      handleClose()
    }
  }

  const handleStartTimeChange = (value: string) => {
    setStartTime(value)
    if (!endTimeManuallySet && value) {
      const calculatedEnd = addMinutesToTime(value, 60)
      setEndTime(calculatedEnd)
    }
  }

  const handleEndTimeChange = (value: string) => {
    setEndTime(value)
    setEndTimeManuallySet(true)
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "日付を選択"
    const [y, m, d] = dateStr.split("-")
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d))
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    return `${y}/${m}/${d}（${weekdays[dateObj.getDay()]}）`
  }

  const isValid = date && startTime && endTime && startTime < endTime

  if (!isOpen) return null

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-250 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none md:items-center">
        <div
          className={`w-full max-w-[640px] bg-white rounded-t-3xl md:rounded-3xl shadow-lg pointer-events-auto ${
            isDragging ? "" : "transition-all duration-250 ease-out"
          } ${isAnimating ? "opacity-100" : "opacity-0"} max-h-[85vh] flex flex-col overflow-hidden overscroll-contain`}
          style={{
            transform: isAnimating ? `translateY(${touchOffset}px)` : "translateY(100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex justify-center pt-3 pb-2 md:hidden cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-[#E5E7EB] rounded-full" />
            </div>

            <div className="px-5 pt-2 pb-4 md:px-6 md:pt-5 md:pb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1A1A1A] tracking-[0.25px]">
                  {mode === "edit" ? "イベントを編集" : "イベントを追加"}
                </h2>
                <button onClick={handleClose} className="rounded-full p-2 hover:bg-[#F5F6F8] transition-colors -mr-2">
                  <X className="h-5 w-5 text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-6 md:py-6 space-y-5">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">イベントの種類</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      eventType === type ? "bg-[#2F80ED] text-white" : "bg-[#F5F6F8] text-[#6B7280] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">状態</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "confirmed"}
                    onChange={() => setStatus("confirmed")}
                    className="h-4 w-4 text-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#333]">確定</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "candidate"}
                    onChange={() => setStatus("candidate")}
                    className="h-4 w-4 text-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#333]">候補日時</span>
                </label>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">日付</label>
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className={`w-full px-3 py-2 border border-[#E5E7EB] rounded-[14px] text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent ${
                    date ? "text-[#333]" : "text-[#A1A1AA]"
                  }`}
                >
                  {formatDisplayDate(date)}
                </button>
                <CustomDatePicker
                  value={date}
                  onChange={setDate}
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                />
              </div>

              <CustomTimeSelect label="開始時刻" value={startTime} onChange={handleStartTimeChange} />
              <CustomTimeSelect label="終了時刻" value={endTime} onChange={handleEndTimeChange} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">タイトル（任意）</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="PdM リードとの面談 など"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent placeholder:text-[#A1A1AA]"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">メモ（任意）</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-5 py-4 md:px-6 flex gap-3 justify-between">
            <div>
              {mode === "edit" && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-[#EF4444] hover:text-red-700 transition-colors"
                >
                  削除
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValid}
                className="px-6 py-2 bg-[#2F80ED] text-white text-sm font-semibold rounded-full hover:bg-blue-600 disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {mode === "edit" ? "変更を保存" : "イベントを保存"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDatePickerOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />}
    </>
  )
}
