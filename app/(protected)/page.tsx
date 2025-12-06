import { getApplications } from "@/app/actions/applications"
import { getGrowthLogs } from "@/app/actions/growth"
import { HomePageClient } from "@/components/home-page-client"
import type { Application, GrowthLog, ApplicationEvent } from "@/lib/mock-data"
import type { Database } from "@/lib/types/database"

// Helper to map DB application to UI Application type
function mapApplicationToUI(
  dbApp: Database['public']['Tables']['applications']['Row'] & { 
    events: Database['public']['Tables']['application_events']['Row'][] 
  }
): Application {
  const events: ApplicationEvent[] = dbApp.events.map(e => ({
    id: e.id,
    date: e.starts_at.split('T')[0], // Assuming ISO string
    startTime: e.starts_at.split('T')[1]?.substring(0, 5) || "00:00",
    endTime: e.ends_at ? e.ends_at.split('T')[1]?.substring(0, 5) || "00:00" : "00:00",
    type: e.kind, // Map kind to type label if needed, or use as is
    status: e.outcome === 'scheduled' ? 'confirmed' : 'candidate', // Simplified mapping
    title: e.title || undefined,
    note: e.notes || "",
  }))

  return {
    id: dbApp.id,
    company: dbApp.company_name,
    position: dbApp.position_title || "",
    stage: dbApp.stage,
    status: "確定", // Default
    nextAction: "なし", // Default
    scheduledDate: "", // Logic to find next event date
    startTime: "",
    endTime: "",
    memo: dbApp.status_note || "",
    sourceType: dbApp.source,
    sourceLabel: "",
    applicationStatus: dbApp.archived ? "closed" : "ongoing",
    stepCurrent: 1, // Placeholder
    stepTotal: 5, // Placeholder
    rejectionStatus: "active", // Placeholder
    events: events,
    globalNote: "",
    todos: [], // Placeholder
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
  const [applicationsData, growthLogsData] = await Promise.all([
    getApplications(),
    getGrowthLogs(),
  ])

  // Cast the data to the expected type with events
  // The getApplications return type needs to be asserted or typed correctly
  const applications = (applicationsData as any[]).map(mapApplicationToUI)
  const growthLogs = growthLogsData.map(mapGrowthLogToUI)

  return (
    <HomePageClient 
      initialApplications={applications}
      initialGrowthLogs={growthLogs}
    />
  )
}
