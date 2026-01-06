import { getApplications } from "@/app/actions/applications"
import { getGrowthLogs } from "@/app/actions/growth"
import { getProfile } from "@/app/actions/profile"
import { getLatestToroEntry, getLatestToroEntryByContext } from "@/app/actions/toro"
import { HomePageClient } from "@/components/home-page-client"
import type { Application, GrowthLog, ApplicationEvent } from "@/lib/mock-data"
import type { Database } from "@/lib/types/database"
import { deriveSelectionPhase } from "@/lib/selection-phase-utils"

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
    "offer_accepted": "内定受諾",
    "aptitude_test": "適性検査",
    "rejected": "お見送り",
    "withdrawn": "辞退",
    "other": "その他",
  }
  return mapping[kind] || kind
}

// Helper to map DB application to UI Application type
function mapApplicationToUI(
  dbApp: Database['public']['Tables']['applications']['Row'] & { 
    events: (Database['public']['Tables']['application_events']['Row'] & {
      links: Database['public']['Tables']['application_event_links']['Row'][]
    })[] 
    links: Database['public']['Tables']['application_links']['Row'][]
  }
): Application {
  const events: ApplicationEvent[] = dbApp.events.map(e => ({
    id: e.id,
    date: e.starts_at.split('T')[0], // Assuming ISO string
    startTime: e.starts_at.split('T')[1]?.substring(0, 5) || "00:00",
    endTime: e.ends_at ? e.ends_at.split('T')[1]?.substring(0, 5) || "00:00" : "00:00",
    type: mapKindToEventType(e.kind), // Map kind to Japanese label
    status: e.outcome === 'scheduled' ? 'confirmed' : 'candidate', // Simplified mapping
    title: e.title || undefined,
    note: e.notes || "",
    links: e.links?.map(l => ({ id: l.id, url: l.url, label: l.label })) || [],
  }))

  const appLinks = dbApp.links?.map(l => ({ id: l.id, url: l.url, label: l.label })) || []

  return {
    id: dbApp.id,
    company: dbApp.company_name,
    position: dbApp.position_title || "",
    stage: dbApp.stage,
    status: "未定", // Default
    nextAction: dbApp.status_note || "なし", 
    scheduledDate: "", // Logic to find next event date
    startTime: "",
    endTime: "",
    memo: (dbApp as any).latest_memo || dbApp.status_note || "ー",
    sourceType: dbApp.source,
    sourceLabel: "",
    applicationStatus: dbApp.archived ? "closed" : "ongoing",
    stepCurrent: 1, // Placeholder
    stepTotal: 5, // Placeholder
    rejectionStatus: "active", // Placeholder
    events: events,
    globalNote: dbApp.status_note || "",
    todos: [], // Placeholder
    selectionPhase: dbApp.selection_phase || deriveSelectionPhase(dbApp.stage),
    links: appLinks,
  }
}

function mapGrowthLogToUI(dbLog: Database['public']['Tables']['growth_logs']['Row']): GrowthLog {
  return {
    id: dbLog.id,
    title: dbLog.title,
    category: dbLog.category,
    type: dbLog.type as any, // Cast if types don't match exactly
    date: dbLog.starts_at.split('T')[0],
    startTime: dbLog.starts_at.split('T')[1]?.substring(0, 5) || "00:00",
    endTime: dbLog.ends_at ? dbLog.ends_at.split('T')[1]?.substring(0, 5) || "00:00" : "00:00",
    memo: dbLog.reflection || "",
    source: dbLog.source,
    createdAt: dbLog.created_at,
    updatedAt: dbLog.updated_at,
  }
}

export default async function Home() {
  const [
    applicationsData, 
    growthLogsData, 
    profile, 
    latestToroEntry,
    latestPriorityEntry,
    latestReasonEntry,
    latestAvoidEntry
  ] = await Promise.all([
    getApplications(),
    getGrowthLogs(),
    getProfile(),
    getLatestToroEntry(),
    getLatestToroEntryByContext({ type: 'job_change_priority' }),
    getLatestToroEntryByContext({ type: 'job_change_reason' }),
    getLatestToroEntryByContext({ type: 'job_change_avoid' }),
  ])

  // Cast the data to the expected type with events
  // The getApplications return type needs to be asserted or typed correctly
  const applications = (applicationsData as any[]).map(mapApplicationToUI)
  const growthLogs = growthLogsData.map(mapGrowthLogToUI)

  return (
    <HomePageClient 
      initialApplications={applications}
      initialGrowthLogs={growthLogs}
      userProfile={profile}
      latestToroEntry={latestToroEntry}
      jobChangeEntries={{
        priority: latestPriorityEntry,
        reason: latestReasonEntry,
        avoid: latestAvoidEntry
      }}
    />
  )
}
