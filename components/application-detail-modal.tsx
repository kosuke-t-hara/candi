"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { X, ChevronDown, ChevronUp, Plus, MoreVertical, Edit, Check, ExternalLink } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import { LoadingOverlay } from "./ui/loading-overlay"
import type { Application, ApplicationEvent } from "@/lib/mock-data"
import { getDisplayCompanyName, getDisplaySourceLabel, getSourceTypeLabel, getDisplayMemo } from "@/lib/mask-utils"
import { updateApplication } from "@/app/actions/applications"
import { AddEventBottomSheet } from "./add-event-bottom-sheet"
import { getStageLabel } from "@/lib/selection-phase-utils"
import { LinkSection } from "./link-section"
import { addApplicationLink, deleteApplicationLink } from "@/app/actions/links"
import { ToroComposer } from "@/app/components/toro/ToroComposer"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Mic } from "lucide-react"

import { getApplicationToroEntries } from "@/app/actions/toro"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

function formatDateDisplay(isoDate: string): string {
  const date = new Date(isoDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}/${day}（${weekday}）`
}

function formatTimeRange(startTime: string, endTime: string): string {
  if (startTime === '00:00' || !startTime) return ""
  return `${startTime}〜${endTime}`
}

function getNextEvent(events: ApplicationEvent[]) {
  const now = new Date()
  const futureEvents = events.filter((e) => {
    const eventDate = new Date(`${e.date}T${e.startTime}`)
    return eventDate > now
  })

  // First try to find confirmed events
  const confirmedFuture = futureEvents.filter((e) => e.status === "confirmed")
  if (confirmedFuture.length > 0) {
    return confirmedFuture.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })[0]
  }

  // If no confirmed, try candidate events
  const candidateFuture = futureEvents.filter((e) => e.status === "candidate")
  if (candidateFuture.length > 0) {
    return candidateFuture.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })[0]
  }

  return null
}

interface ApplicationDetailModalProps {
  application: Application
  isMasked: boolean
  isOpen: boolean
  onClose: () => void
  onEventAdded: (applicationId: string, event: Omit<ApplicationEvent, "id">) => void
  onEventUpdated: (applicationId: string, eventId: string, event: Omit<ApplicationEvent, "id">) => void
  onEventDeleted: (applicationId: string, eventId: string) => void
}

export function ApplicationDetailModal({
  application,
  isMasked,
  isOpen,
  onClose,
  onEventAdded,
  onEventUpdated,
  onEventDeleted,
}: ApplicationDetailModalProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set())
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ApplicationEvent | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchOffset, setTouchOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")

  const [isEditingPosition, setIsEditingPosition] = useState(false)
  const [editedPosition, setEditedPosition] = useState("")

  const [memoEntries, setMemoEntries] = useState<any[]>([])

  const [isProcessing, setIsProcessing] = useState(false)
  const [isToroOpen, setIsToroOpen] = useState(false)
  const [editingToroEntry, setEditingToroEntry] = useState<any>(null)
  const [toroContext, setToroContext] = useState<any>(null)

  const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false)

  const handleUpdateSource = (source: string) => {
    startTransition(async () => {
      // @ts-ignore
      await updateApplication(application.id, { source })
      setIsSourceMenuOpen(false)
    })
  }

  useEffect(() => {
    if (isOpen) {
      setEditedTitle(application.company)
      setIsEditingTitle(false)
      setEditedPosition(application.position)
      setIsEditingPosition(false)
      
      const fetchMemos = async () => {
        // Fetch more entries to cover both global notes and event notes
        const entries = await getApplicationToroEntries(application.id, 50)
        setMemoEntries(entries)
      }
      fetchMemos()
    }
  }, [isOpen, application.company, application.id])

  const handleSaveTitle = () => {
    if (!editedTitle.trim()) return
    
    startTransition(async () => {
      await updateApplication(application.id, { company_name: editedTitle })
      setIsEditingTitle(false)
    })
  }

  const handleSavePosition = () => {
    if (!editedPosition.trim()) return

    startTransition(async () => {
      await updateApplication(application.id, { position_title: editedPosition })
      setIsEditingPosition(false)
    })
  }

  // handleSaveMemo removed as we now use Toro entries


  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
      setTouchStart(null)
      setTouchOffset(0)
      setIsDragging(false)
    }, 250)
  }

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
    const threshold = 100 // Close if swiped down more than 100px
    const velocity = touchOffset

    if (velocity > threshold) {
      handleClose()
    } else {
      // Snap back
      setTouchOffset(0)
    }

    setTouchStart(null)
    setIsDragging(false)
  }

  const handleAddEventClose = () => {
    setIsAddEventOpen(false)
  }

  if (!isOpen) return null

  const toggleEvent = (index: number) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const sortedEvents = [...application.events].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return b.startTime.localeCompare(a.startTime)
  })

  const handleAddEvent = async (event: Omit<ApplicationEvent, "id">) => {
    setIsProcessing(true)
    try {
      await onEventAdded(application.id, event)
      setIsAddEventOpen(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateEvent = async (event: Omit<ApplicationEvent, "id">) => {
    if (editingEvent) {
      setIsProcessing(true)
      try {
        await onEventUpdated(application.id, editingEvent.id, event)
        setEditingEvent(null)
        setIsAddEventOpen(false)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      setIsProcessing(true)
      try {
        await onEventDeleted(application.id, editingEvent.id)
        setEditingEvent(null)
        setIsAddEventOpen(false)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleEditEvent = (event: ApplicationEvent) => {
    setEditingEvent(event)
    setIsAddEventOpen(true)
  }

  const nextEvent = getNextEvent(application.events)

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-250 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <div
          className={`w-full max-w-[640px] bg-white rounded-t-3xl shadow-lg pointer-events-auto ${
            isDragging ? "" : "transition-all duration-250 ease-out"
          } ${
            isAnimating ? "opacity-100" : "opacity-0"
          } max-h-[80vh] min-h-[40vh] flex flex-col overflow-hidden overscroll-contain`}
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
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-[#E5E7EB] rounded-full" />
            </div>

            <div className="px-4 pb-4 md:px-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                       <input 
                         type="text"
                         value={editedTitle}
                         onChange={(e) => setEditedTitle(e.target.value)}
                         className="flex-1 text-xl font-bold text-[#1A1A1A] border-b-2 border-[#2F80ED] focus:outline-none bg-transparent"
                         autoFocus
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') handleSaveTitle()
                           if (e.key === 'Escape') setIsEditingTitle(false)
                         }}
                       />
                       <button 
                         onClick={handleSaveTitle}
                         disabled={isPending}
                         className="p-1 rounded-full bg-[#E7F8ED] text-[#34A853] hover:bg-[#D1F2DD] flex items-center justify-center min-w-[28px] min-h-[28px]"
                       >
                         {isPending ? <LoadingSpinner size={16} className="text-[#34A853]" /> : <Check className="h-5 w-5" />}
                       </button>
                    </div>

                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h2 className="text-xl font-bold text-[#1A1A1A] tracking-[0.25px]">
                        {getDisplayCompanyName(application.company, isMasked)}
                      </h2>
                      {!isMasked && (
                        <button 
                          onClick={() => setIsEditingTitle(true)}
                          className="transition-opacity p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {isEditingPosition ? (
                    <div className="flex items-center gap-2 mt-1">
                       <input 
                         type="text"
                         value={editedPosition}
                         onChange={(e) => setEditedPosition(e.target.value)}
                         className="flex-1 text-sm text-[#6B7280] border-b border-[#2F80ED] focus:outline-none bg-transparent"
                         autoFocus
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') handleSavePosition()
                           if (e.key === 'Escape') setIsEditingPosition(false)
                         }}
                       />
                       <button 
                         onClick={handleSavePosition}
                         disabled={isPending}
                         className="p-0.5 rounded-full bg-[#E7F8ED] text-[#34A853] hover:bg-[#D1F2DD] flex items-center justify-center min-w-[24px] min-h-[24px]"
                       >
                         {isPending ? <LoadingSpinner size={14} className="text-[#34A853]" /> : <Check className="h-4 w-4" />}
                       </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group mt-0.5">
                      <p className="text-sm text-[#6B7280]">{application.position}</p>
                      {!isMasked && (
                        <button 
                          onClick={() => setIsEditingPosition(true)}
                          className="transition-opacity p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF]"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={handleClose} className="ml-4 rounded-full p-2 hover:bg-[#F5F6F8] transition-colors">
                  <X className="h-5 w-5 text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-6 space-y-6">
            <div className="rounded-[14px] bg-[#F5F6F8] p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <div className="relative inline-block">
                  <button
                    onClick={() => !isMasked && setIsSourceMenuOpen(!isSourceMenuOpen)}
                    disabled={isMasked}
                    className={`inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-[#555] shadow-sm ${
                      !isMasked ? "cursor-pointer hover:bg-gray-50" : "cursor-default"
                    }`}
                  >
                    {getSourceTypeLabel(application.sourceType)}
                  </button>
                  
                  {isSourceMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSourceMenuOpen(false)} />
                      <div className="absolute top-full left-0 z-50 mt-1 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                        {(["agent", "direct", "self", "referral", "other"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => handleUpdateSource(type)}
                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 ${
                              application.sourceType === type ? "font-bold text-blue-600 bg-blue-50" : "text-gray-700"
                            }`}
                          >
                            {getSourceTypeLabel(type)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <span className="inline-block rounded-full bg-[#E8F1FF] px-3 py-1 text-xs font-medium text-[#2F80ED]">
                  {getStageLabel(application.stage)}
                </span>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    application.applicationStatus === "closed"
                     ? "bg-[#F3F4F6] text-[#A1A1AA]"
                     : application.status === "確定"
                      ? "bg-[#E7F8ED] text-[#34A853]"
                      : application.status === "相手ボール"
                        ? "bg-[#FFF7DA] text-[#E6B400]"
                        : "bg-white text-[#A1A1AA] shadow-sm"
                  }`}
                >
                  {application.applicationStatus === "closed" ? "終了" : application.status}
                </span>
              </div>

              {application.sourceLabel && (
                <p className="text-sm text-[#6B7280]">
                  {getDisplaySourceLabel(application.sourceType, application.sourceLabel, isMasked)}
                </p>
              )}

              {nextEvent ? (
                <div className="pt-2 border-t border-[#E5E7EB]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-[#6B7280] mb-1">
                        次のイベント：
                        {nextEvent.status === "candidate" && <span className="text-[#E6B400]">(調整中)</span>}
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {formatDateDisplay(nextEvent.date)}{" "}
                        <span className="text-[#6B7280] font-normal">
                          {formatTimeRange(nextEvent.startTime, nextEvent.endTime)}
                        </span>
                      </p>
                      <p className="text-sm text-[#6B7280]">{nextEvent.title || nextEvent.type}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingEvent(null)
                        setIsAddEventOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#2F80ED] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-sm flex-shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      追加
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[#6B7280]">次のイベントはまだありません</p>
                    <button
                      onClick={() => {
                        setEditingEvent(null)
                        setIsAddEventOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#2F80ED] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-sm flex-shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3 tracking-[0.25px]">イベントタイムライン</h3>
              <div className="space-y-4">
                {sortedEvents.map((event, index) => {
                  const isExpanded = expandedEvents.has(index)
                  const hasNote = event.note && event.note.trim() !== ""

                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-[#2F80ED] flex-shrink-0 mt-1" />
                        {index < sortedEvents.length - 1 && <div className="w-0.5 flex-1 bg-[#E5E7EB] min-h-[40px]" />}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-[#1A1A1A]">
                              {formatDateDisplay(event.date)}{" "}
                              <span className="text-[#6B7280] font-normal">
                                {formatTimeRange(event.startTime, event.endTime)}
                              </span>
                              {event.status === "candidate" && (
                                <span className="ml-1 text-xs text-[#E6B400]">(調整中)</span>
                              )}
                            </div>
                            <div className="text-sm text-[#6B7280] mt-0.5">{event.type}</div>
                            {event.person && <div className="text-sm text-[#555] mt-1">{event.person}</div>}
                          </div>
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-1.5 rounded-full hover:bg-[#F5F6F8] transition-colors flex-shrink-0"
                            aria-label="イベントを編集"
                          >
                            <MoreVertical className="h-4 w-4 text-[#A1A1AA]" />
                          </button>
                        </div>

                        {/* Event Notes Section Header */}
                        {!isMasked && (
                          <div className="flex items-center justify-between mt-2 mb-1">
                            <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">メモ</span>
                            {memoEntries.filter(entry => entry.context?.eventId === event.id).length < 3 && (
                              <button
                                onClick={() => {
                                  setEditingToroEntry(null)
                                  setToroContext({
                                    source: 'candi_event',
                                    applicationId: application.id,
                                    eventId: event.id,
                                    eventTitle: event.title || event.type
                                  })
                                  setIsToroOpen(true)
                                }}
                                className="text-[10px] font-medium text-[#2F80ED] hover:underline flex items-center gap-0.5"
                              >
                                <Plus className="h-3 w-3" />
                                メモを追加
                              </button>
                            )}
                          </div>
                        )}

                        {/* Show Toro entries for this specific event */}
                        {!isMasked && (
                          <div className="mt-2 space-y-2">
                            {memoEntries
                              .filter(entry => entry.context?.eventId === event.id)
                              .slice(0, 3) // Latest 3 for the event
                              .map((entry, idx) => (
                                <div key={entry.id} className="bg-[#F5F6F8]/50 p-2 rounded-lg group/entry relative">
                                  <div className="absolute top-2 right-2 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setEditingToroEntry(entry)
                                        setIsToroOpen(true)
                                      }}
                                      className="p-1.5 rounded-md bg-white/90 hover:bg-white text-[#6B7280] hover:text-[#2F80ED] shadow-sm border border-black/5"
                                      title="編集"
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap pr-8">
                                    {entry.content}
                                  </p>
                                  <p className="text-[10px] text-[#A1A1AA] mt-1">
                                    {new Date(entry.created_at).toLocaleString('ja-JP', { 
                                      month: 'numeric', 
                                      day: 'numeric', 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                    {new Date(entry.updated_at).getTime() - new Date(entry.created_at).getTime() > 10000 && (
                                      <span className="ml-2">
                                        (更新: {new Date(entry.updated_at).toLocaleString('ja-JP', { 
                                          month: 'numeric', 
                                          day: 'numeric', 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}

                        {event.links && event.links.length > 0 && (
                          <div className="mt-2">
                            <a 
                              href={event.links[0].url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 p-1.5 -ml-1.5 rounded-md hover:bg-[#E7F8ED] text-xs font-medium text-[#2F80ED] transition-colors group/link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[240px]">
                                {event.links[0].label || event.links[0].url}
                              </span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#1A1A1A] tracking-[0.25px]">この応募のメモ</h3>
                {!isMasked && memoEntries.filter(entry => !entry.context?.eventId).length < 3 && (
                  <button
                    onClick={() => {
                      setEditingToroEntry(null)
                      setToroContext({
                        source: 'candi_application',
                        applicationId: application.id,
                        companyName: application.company
                      })
                      setIsToroOpen(true)
                    }}
                    className="text-xs font-medium text-[#2F80ED] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    メモを追加
                  </button>
                )}
              </div>
              <div 
                className="rounded-[14px] bg-[#F5F6F8] p-4 relative transition-all min-h-[60px]"
              >
                {isMasked ? (
                  <p className="text-sm text-[#333]">***</p>
                ) : (
                  <>
                    {/* Global notes (entries with no eventId) */}
                    {memoEntries
                      .filter(entry => !entry.context?.eventId)
                      .slice(0, 3).length > 0 ? (
                      <div className="space-y-4">
                        {memoEntries
                          .filter(entry => !entry.context?.eventId)
                          .slice(0, 3)
                          .map((entry, idx) => (
                          <div key={entry.id} className={`group/entry relative ${idx !== 0 ? 'border-t border-black/5 pt-4' : ''}`}>
                            <div className={`absolute right-0 opacity-0 group-hover/entry:opacity-100 transition-opacity ${idx !== 0 ? 'top-4' : 'top-0'}`}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingToroEntry(entry)
                                  setIsToroOpen(true)
                                }}
                                className="p-1 px-1.5 rounded-md bg-white hover:bg-white text-[#6B7280] hover:text-[#2F80ED] shadow-sm border border-black/5"
                                title="編集"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap pr-8">
                              {entry.content}
                            </p>
                            <p className="text-[10px] text-[#A1A1AA] mt-1">
                              {new Date(entry.created_at).toLocaleString('ja-JP', { 
                                month: 'numeric', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {new Date(entry.updated_at).getTime() - new Date(entry.created_at).getTime() > 10000 && (
                                <span className="ml-2">
                                  (更新: {new Date(entry.updated_at).toLocaleString('ja-JP', { 
                                    month: 'numeric', 
                                    day: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })})
                                </span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#A1A1AA]">まだメモはありません</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <LinkSection 
                links={application.links || []}
                onAddLink={async (url, label) => {
                  await addApplicationLink(application.id, url, label)
                }}
                onDeleteLink={async (id) => {
                  await deleteApplicationLink(id)
                }}
              />
            </div>

            {application.todos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 tracking-[0.25px]">関連するTo-Do</h3>
                <div className="space-y-2">
                  {application.todos.map((todo) => (
                    <div key={todo.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        readOnly
                        className="mt-0.5 h-4 w-4 rounded border-[#E5E7EB] text-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-0"
                      />
                      <span className={`text-sm ${todo.completed ? "text-[#A1A1AA] line-through" : "text-[#333]"}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddEventBottomSheet
        isOpen={isAddEventOpen}
        onClose={handleAddEventClose}
        onSave={editingEvent ? handleUpdateEvent : handleAddEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
        mode={editingEvent ? "edit" : "add"}
        existingEvent={editingEvent || undefined}
        applicationId={application.id}
      />

      <Sheet open={isToroOpen} onOpenChange={(open) => {
        setIsToroOpen(open)
        if (!open) {
          setEditingToroEntry(null)
          setToroContext(null)
        }
      }}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px] p-0 max-w-[640px] mx-auto inset-x-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-lg font-light tracking-wide text-black/70"></SheetTitle>
          </SheetHeader>
          <div className="px-6 pt-4 pb-6 h-full overflow-y-auto">
            <ToroComposer 
              isAuthenticated={true} 
              context={toroContext}
              entryId={editingToroEntry?.id}
              defaultValue={editingToroEntry?.content || ''}
              onSaved={async () => {
                setIsToroOpen(false)
                setEditingToroEntry(null)
                setToroContext(null)
                const entries = await getApplicationToroEntries(application.id, 50)
                setMemoEntries(entries)
              }}
              className="h-full"
            />
          </div>
        </SheetContent>
      </Sheet>
      <LoadingOverlay isVisible={isPending || isProcessing} />
    </>
  )
}
