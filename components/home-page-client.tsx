"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { ToroComposer } from "@/app/components/toro/ToroComposer"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events"
import { addEventLink } from "@/app/actions/links"
import { JobChangeDetails } from "@/components/job-change-details"
import { LatestNote } from "@/components/latest-note"
import { type SortMode, type SortDirection } from "@/lib/sort-utils"
import type { Application, ApplicationEvent, GrowthLog } from "@/lib/mock-data"
import type { Database } from "@/lib/types/database"

// Map Japanese event type labels to database enum values
function mapEventTypeToKind(type: string): Database['public']['Tables']['application_events']['Row']['kind'] {
  const mapping: Record<string, Database['public']['Tables']['application_events']['Row']['kind']> = {
    "カジュアル面談": "casual_talk",
    "書類選考": "screening_call",
    "適性検査": "aptitude_test",
    "一次面接": "interview_1st",
    "二次面接": "interview_2nd",
    "三次面接": "interview_3rd",
    "最終面接": "interview_final",
    "オファー面談": "offer_meeting",
    "内定受諾": "offer_accepted",
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
    "aptitude_test": "適性検査",
    "interview_1st": "一次面接",
    "interview_2nd": "二次面接",
    "interview_3rd": "三次面接",
    "interview_final": "最終面接",
    "offer_meeting": "オファー面談",
    "offer_accepted": "内定受諾",
    "rejected": "お見送り",
    "withdrawn": "辞退",
    "other": "その他",
  }
  return mapping[kind] || kind
}

// Define local type for ToroEntry since it's missing in generated types
interface ToroEntry {
  id: string
  user_id: string
  content: string
  context: any
  created_at: string
  updated_at: string
  archived_at: string | null
}

interface HomePageClientProps {
  initialApplications: Application[]
  initialGrowthLogs: GrowthLog[]
  userProfile: Database['public']['Tables']['profiles']['Row'] | null
  latestToroEntry: ToroEntry | null
  jobChangeEntries: {
    priority: ToroEntry | null
    reason: ToroEntry | null
    avoid: ToroEntry | null
  }
}

export function HomePageClient({ initialApplications, initialGrowthLogs, userProfile, latestToroEntry, jobChangeEntries }: HomePageClientProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter() // Add router
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isToroSheetOpen, setIsToroSheetOpen] = useState(false)
  const [isMasked, setIsMasked] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>("nextEvent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [applications, setApplications] = useState<Application[]>(initialApplications)

  // Sync props to state if needed (e.g. after server revalidation)
  useEffect(() => {
    setApplications(initialApplications)
  }, [initialApplications])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeApplications = sortMode === "archived" 
    ? applications.filter((app) => app.applicationStatus === "closed")
    : applications.filter((app) => app.applicationStatus === "ongoing")

  // Rename variable for clarity in the rest of the component
  const ongoingApplications = activeApplications
  
  // Calculate stats for CandidateSummary
  // Gate date-dependent logic with isMounted to avoid hydration mismatch
  const ongoingCount = ongoingApplications.length
  
  const weeklyEventCount = isMounted ? applications.reduce((acc, app) => {
    const today = new Date()
    today.setHours(0,0,0,0) // Normalize today
    const oneWeekLater = new Date(today)
    oneWeekLater.setDate(today.getDate() + 7)
    
    const eventsInWeek = app.events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate >= today && eventDate <= oneWeekLater
    }).length
    
    return acc + eventsInWeek
  }, 0) : 0

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
    setSortDirection((prev: SortDirection) => (prev === "asc" ? "desc" : "asc"))
  }

  const handleApplicationClick = (id: string) => {
    setSelectedApplicationId(id)
  }

  const handleEventAdded = (applicationId: string, event: Omit<ApplicationEvent, "id">) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", event.title || event.type)
      formData.append("kind", mapEventTypeToKind(event.type))
      formData.append("starts_at", `${event.date}T${event.startTime || '00:00'}:00`)
      formData.append("ends_at", `${event.date}T${event.endTime || '00:00'}:00`)
      formData.append("outcome", "scheduled")
      formData.append("status", event.status)
      formData.append("notes", event.note || "")
      
      const newEvent = await createEvent(applicationId, formData)

      if (newEvent && event.links && event.links.length > 0) {
        for (const link of event.links) {
          await addEventLink(newEvent.id, link.url, link.label || undefined)
        }
      }
    })
  }

  const handleEventUpdated = (applicationId: string, eventId: string, event: Omit<ApplicationEvent, "id">) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", event.title || event.type)
      formData.append("kind", mapEventTypeToKind(event.type))
      formData.append("starts_at", `${event.date}T${event.startTime || '00:00'}:00`)
      formData.append("ends_at", `${event.date}T${event.endTime || '00:00'}:00`)
      formData.append("outcome", "scheduled")
      formData.append("status", event.status)
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
    <div className="min-h-screen bg-[#F5F6F8] w-full">
      <Header />
      <main className="mx-auto w-full max-w-full md:max-w-5xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <CandidateSummary 
          isMasked={isMasked} 
          onToggleMask={() => setIsMasked(!isMasked)} 
          profile={userProfile}
          ongoingCount={ongoingCount}
          weeklyCount={weeklyEventCount}
          onOngoingClick={handleScrollToApplications}
        />
        
        <JobChangeDetails 
          profile={userProfile}
          isMasked={isMasked}
          entries={jobChangeEntries}
        />
        
        {/* Latest Memo ("Hitokoto") Section */}
        {latestToroEntry && (
          <LatestNote 
            content={latestToroEntry.content}
            createdAt={latestToroEntry.created_at}
          />
        )}

        <WeeklySchedule
          isMasked={isMasked}
          onEventClick={handleApplicationClick}
          applications={ongoingApplications}
          growthLogs={initialGrowthLogs}
        />
        <div id="ongoing-applications" className="mt-12 md:mt-16">
          <ApplicationTable
            isMasked={isMasked}
            sortMode={sortMode}
            sortDirection={sortDirection}
            onSortModeChange={handleSortModeChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            onApplicationClick={handleApplicationClick}
            onAddClick={() => setIsSheetOpen(true)}
            applications={ongoingApplications}
          />
          <ApplicationCardList
            isMasked={isMasked}
            sortMode={sortMode}
            sortDirection={sortDirection}
            onSortModeChange={handleSortModeChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            onApplicationClick={handleApplicationClick}
            onAddClick={() => setIsSheetOpen(true)}
            applications={ongoingApplications}
          />
        </div>
      </main>
      <FloatingActionButton onClick={() => setIsToroSheetOpen(true)} />
      <NewOpportunityBottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      
      <Sheet open={isToroSheetOpen} onOpenChange={setIsToroSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] bg-white rounded-t-[20px] p-0 border-none overflow-hidden max-w-[640px] mx-auto inset-x-0">
          <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b border-black/5 flex-shrink-0">
              <SheetTitle className="text-xl font-medium text-black/80">今のひとこと</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <ToroComposer 
                isAuthenticated={!!userProfile} 
                onSaved={() => {
                  setIsToroSheetOpen(false)
                  router.refresh()
                }}
                context={{ type: 'hitokoto' }}
                className="mt-0"
                placeholder="今の気持ちを、そのままに。"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
