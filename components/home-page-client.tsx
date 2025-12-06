"use client"

import { useState, useEffect, useTransition } from "react"
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
import { createEvent } from "@/app/actions/events"
import type { SortMode, SortDirection } from "@/lib/sort-utils"
import type { Application, ApplicationEvent, GrowthLog } from "@/lib/mock-data"

interface HomePageClientProps {
  initialApplications: Application[]
  initialGrowthLogs: GrowthLog[]
}

export function HomePageClient({ initialApplications, initialGrowthLogs }: HomePageClientProps) {
  const [isPending, startTransition] = useTransition()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isMasked, setIsMasked] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>("nextEvent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>(initialApplications)

  // Sync props to state if needed (e.g. after server revalidation)
  useEffect(() => {
    setApplications(initialApplications)
  }, [initialApplications])

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
    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", event.title || event.type)
      formData.append("kind", "other") // Default to other for now
      formData.append("starts_at", `${event.date}T${event.startTime}:00`)
      // Note: ends_at is not currently handled by createEvent action, might need update
      
      await createEvent(applicationId, formData)
    })
  }

  const handleEventUpdated = (applicationId: string, eventId: string, event: Omit<ApplicationEvent, "id">) => {
    console.log("Event updated locally", applicationId, eventId, event)
  }

  const handleEventDeleted = (applicationId: string, eventId: string) => {
    console.log("Event deleted locally", applicationId, eventId)
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
          growthLogs={initialGrowthLogs}
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
