"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CandidateSummary } from "@/components/candidate-summary"
import { DailyQuestionCard } from "@/components/daily-question-card"
import { ApplicationTable } from "@/components/application-table"
import { ApplicationCardList } from "@/components/application-card-list"
import { TodoSection } from "@/components/todo-section"
import { FloatingActionButton } from "@/components/floating-action-button"
import { NewOpportunityBottomSheet } from "@/components/new-opportunity-bottom-sheet"
import { WeeklySchedule } from "@/components/weekly-schedule"
import { ApplicationDetailModal } from "@/components/application-detail-modal"
import { applications as initialApplications, growthLogs } from "@/lib/mock-data"
import type { SortMode, SortDirection } from "@/lib/sort-utils"
import type { Application, ApplicationEvent } from "@/lib/mock-data"

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isMasked, setIsMasked] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>("nextEvent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>(initialApplications)

  const ongoingApplications = applications.filter((app) => app.applicationStatus === "ongoing")

  const handleSortModeChange = (mode: SortMode) => {
    setSortMode(mode)
    setSortDirection("asc")
  }

  const handleSortDirectionToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const handleApplicationClick = (id: string) => {
    setSelectedApplicationId(id)
  }

  const handleEventAdded = (applicationId: string, event: Omit<ApplicationEvent, "id">) => {
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id !== applicationId) return app

        const newEventId = `e${applicationId}-${Date.now()}`
        const newEvent: ApplicationEvent = {
          ...event,
          id: newEventId,
        }

        const updatedEvents = [...app.events, newEvent].sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date)
          if (dateCompare !== 0) return dateCompare
          return a.startTime.localeCompare(b.startTime)
        })

        const futureConfirmed = updatedEvents.filter((e) => {
          const eventDate = new Date(`${e.date}T${e.startTime}`)
          return eventDate > new Date() && e.status === "confirmed"
        })

        const nextConfirmed = futureConfirmed[0]

        return {
          ...app,
          events: updatedEvents,
          scheduledDate: nextConfirmed?.date || app.scheduledDate,
          startTime: nextConfirmed?.startTime || app.startTime,
          endTime: nextConfirmed?.endTime || app.endTime,
        }
      }),
    )
  }

  const handleEventUpdated = (applicationId: string, eventId: string, event: Omit<ApplicationEvent, "id">) => {
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id !== applicationId) return app

        const updatedEvents = app.events
          .map((e) => (e.id === eventId ? { ...event, id: eventId } : e))
          .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date)
            if (dateCompare !== 0) return dateCompare
            return a.startTime.localeCompare(b.startTime)
          })

        const futureConfirmed = updatedEvents.filter((e) => {
          const eventDate = new Date(`${e.date}T${e.startTime}`)
          return eventDate > new Date() && e.status === "confirmed"
        })

        const nextConfirmed = futureConfirmed[0]

        return {
          ...app,
          events: updatedEvents,
          scheduledDate: nextConfirmed?.date || app.scheduledDate,
          startTime: nextConfirmed?.startTime || app.startTime,
          endTime: nextConfirmed?.endTime || app.endTime,
        }
      }),
    )
  }

  const handleEventDeleted = (applicationId: string, eventId: string) => {
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id !== applicationId) return app

        const updatedEvents = app.events
          .filter((e) => e.id !== eventId)
          .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date)
            if (dateCompare !== 0) return dateCompare
            return a.startTime.localeCompare(b.startTime)
          })

        const futureConfirmed = updatedEvents.filter((e) => {
          const eventDate = new Date(`${e.date}T${e.startTime}`)
          return eventDate > new Date() && e.status === "confirmed"
        })

        const nextConfirmed = futureConfirmed[0]

        return {
          ...app,
          events: updatedEvents,
          scheduledDate: nextConfirmed?.date || "",
          startTime: nextConfirmed?.startTime || "",
          endTime: nextConfirmed?.endTime || "",
        }
      }),
    )
  }

  const selectedApplication = selectedApplicationId
    ? applications.find((app) => app.id === selectedApplicationId)
    : null

  useEffect(() => {
    if (selectedApplicationId) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"

      return () => {
        document.body.style.overflow = ""
        document.body.style.touchAction = ""
      }
    }
  }, [selectedApplicationId])

  return (
    <div className="min-h-screen bg-[#F5F6F8] overflow-x-hidden max-w-full">
      <Header />
      <main className="mx-auto w-full max-w-full md:max-w-5xl px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden">
        <CandidateSummary isMasked={isMasked} onToggleMask={() => setIsMasked(!isMasked)} />
        <DailyQuestionCard />
        <TodoSection isMasked={isMasked} />
        <WeeklySchedule
          isMasked={isMasked}
          onEventClick={handleApplicationClick}
          applications={ongoingApplications}
          growthLogs={growthLogs}
        />
        <div className="mt-6">
          <ApplicationTable
            isMasked={isMasked}
            sortMode={sortMode}
            sortDirection={sortDirection}
            onSortModeChange={handleSortModeChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            onApplicationClick={handleApplicationClick}
            applications={ongoingApplications}
          />
          <ApplicationCardList
            isMasked={isMasked}
            sortMode={sortMode}
            sortDirection={sortDirection}
            onSortModeChange={handleSortModeChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            onApplicationClick={handleApplicationClick}
            applications={ongoingApplications}
          />
        </div>
      </main>
      <FloatingActionButton onClick={() => setIsSheetOpen(true)} />
      <NewOpportunityBottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          isMasked={isMasked}
          isOpen={!!selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
          onEventAdded={handleEventAdded}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      )}
    </div>
  )
}
