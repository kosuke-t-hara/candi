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
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events"
import { SortControls, type SortMode, type SortDirection } from "@/components/sort-controls"
import type { Application, ApplicationEvent, GrowthLog } from "@/lib/mock-data"
import type { Database } from "@/lib/types/database"

// Map Japanese event type labels to database enum values
function mapEventTypeToKind(type: string): Database['public']['Tables']['application_events']['Row']['kind'] {
  const mapping: Record<string, Database['public']['Tables']['application_events']['Row']['kind']> = {
    "カジュアル面談": "casual_talk",
    "書類選考": "screening_call",
    "一次面接": "interview_1st",
    "二次面接": "interview_2nd",
    "三次面接": "interview_3rd",
    "最終面接": "interview_final",
    "オファー面談": "offer_meeting",
    "お見送り": "rejected",
    "辞退": "withdrawn",
    "その他": "other",
  }
  return mapping[type] || "other"
}

// Map database enum values to Japanese labels
function mapKindToEventType(kind: string): string {
  const mapping: Record<string, string> = {
    "casual_talk": "カジュアル面談",
    "screening_call": "書類選考",
    "interview_1st": "一次面接",
    "interview_2nd": "二次面接",
    "interview_3rd": "三次面接",
    "interview_final": "最終面接",
    "offer_meeting": "オファー面談",
    "rejected": "お見送り",
    "withdrawn": "辞退",
    "other": "その他",
  }
  return mapping[kind] || kind
}

interface HomePageClientProps {
  initialApplications: Application[]
  initialGrowthLogs: GrowthLog[]
  userProfile: Database['public']['Tables']['profiles']['Row'] | null
}

export function HomePageClient({ initialApplications, initialGrowthLogs, userProfile }: HomePageClientProps) {
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



  const activeApplications = sortMode === "archived" 
    ? applications.filter((app) => app.applicationStatus === "closed")
    : applications.filter((app) => app.applicationStatus === "ongoing")

  // Rename variable for clarity in the rest of the component
  const ongoingApplications = activeApplications
  
  // Calculate stats for CandidateSummary
  const ongoingCount = ongoingApplications.length
  
  const weeklyActivitiesCount = applications.reduce((acc, app) => {
    const today = new Date()
    const oneWeekLater = new Date(today)
    oneWeekLater.setDate(today.getDate() + 7)
    
    // Check events
    const hasWeeklyEvent = app.events.some(e => {
      const eventDate = new Date(e.date)
      return eventDate >= today && eventDate <= oneWeekLater
    })
    
    return acc + (hasWeeklyEvent ? 1 : 0) // Count applications that have activity? Or count total events?
    // User asked for "この期間の転職活動...の件数". 
    // "Number of job changing activities in this period". 
    // Usually means number of events. Let's count total events in the week.
  }, 0)

  // Re-calculating correctly for events count
  const weeklyEventCount = applications.reduce((acc, app) => {
    const today = new Date()
    today.setHours(0,0,0,0) // Normalize today
    const oneWeekLater = new Date(today)
    oneWeekLater.setDate(today.getDate() + 7)
    
    const eventsInWeek = app.events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate >= today && eventDate <= oneWeekLater
    }).length
    
    return acc + eventsInWeek
  }, 0)

  const handleScrollToApplications = () => {
    const element = document.getElementById("ongoing-applications")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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
      formData.append("kind", mapEventTypeToKind(event.type))
      formData.append("starts_at", `${event.date}T${event.startTime}:00`)
      formData.append("ends_at", `${event.date}T${event.endTime}:00`)
      formData.append("outcome", event.status === "confirmed" ? "scheduled" : "scheduled")
      formData.append("notes", event.note || "")
      
      await createEvent(applicationId, formData)
    })
  }

  const handleEventUpdated = (applicationId: string, eventId: string, event: Omit<ApplicationEvent, "id">) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", event.title || event.type)
      formData.append("kind", mapEventTypeToKind(event.type))
      formData.append("starts_at", `${event.date}T${event.startTime}:00`)
      formData.append("ends_at", `${event.date}T${event.endTime}:00`)
      formData.append("outcome", event.status === "confirmed" ? "scheduled" : "scheduled")
      formData.append("notes", event.note || "")
      
      await updateEvent(eventId, formData)
    })
  }

  const handleEventDeleted = (applicationId: string, eventId: string) => {
    startTransition(async () => {
      await deleteEvent(eventId)
    })
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
        <CandidateSummary 
          isMasked={isMasked} 
          onToggleMask={() => setIsMasked(!isMasked)} 
          profile={userProfile}
          ongoingCount={ongoingCount}
          weeklyCount={weeklyEventCount}
          onOngoingClick={handleScrollToApplications}
        />
        <DailyQuestionCard />
        <TodoSection isMasked={isMasked} />
        <WeeklySchedule
          isMasked={isMasked}
          onEventClick={handleApplicationClick}
          applications={ongoingApplications}
          growthLogs={initialGrowthLogs}
        />
        <div id="ongoing-applications" className="mt-6">
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
