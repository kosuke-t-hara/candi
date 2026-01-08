import type { Application } from "./mock-data"

export type SortMode = "nextEvent" | "stage" | "archived"
export type SortDirection = "asc" | "desc"

export function parseTimeToMinutes(time: string | undefined): number | null {
  if (!time || time === "ー") return null
  const match = time.match(/^(\d{1,2}):(\d{1,2})$/)
  if (!match) return null
  const hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  return hours * 60 + minutes
}

export function parseDateToValue(dateStr: string | undefined): number | null {
  if (!dateStr || dateStr === "ー") return null
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (isoMatch) {
    const year = Number.parseInt(isoMatch[1], 10)
    const month = Number.parseInt(isoMatch[2], 10)
    const day = Number.parseInt(isoMatch[3], 10)
    return year * 10000 + month * 100 + day
  }
  const jpMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})/)
  if (jpMatch) {
    const month = Number.parseInt(jpMatch[1], 10)
    const day = Number.parseInt(jpMatch[2], 10)
    return 2026 * 10000 + month * 100 + day
  }
  return null
}

export function getRelevantEventSortValue(app: Application): number {
  if (!app.events || app.events.length === 0) {
    return 99991231 * 10000 // Last fallback
  }

  // Current time for comparison
  const now = new Date().getTime()
  
  const parsedEvents = app.events.map(e => {
    const dateVal = parseDateToValue(e.date) || 99991231
    const timeVal = parseTimeToMinutes(e.startTime) || 0
    // Use T format without Z to treat as local time (JST in browser)
    const timestamp = new Date(`${e.date}T${e.startTime || '00:00'}`).getTime()
    return { timestamp, sortKey: dateVal * 10000 + timeVal }
  }).sort((a, b) => a.timestamp - b.timestamp)

  const futureEvent = parsedEvents.find(e => e.timestamp >= now)
  if (futureEvent) {
    // Future events are prioritized (lowest sortKey among futures)
    return futureEvent.sortKey
  }

  // Past events: show most recent first, but after all future events
  const lastEvent = parsedEvents[parsedEvents.length - 1]
  return 88880000 * 10000 + (100000000 - lastEvent.sortKey) 
}

export function sortApplications(
  applications: Application[],
  sortMode: SortMode,
  sortDirection: SortDirection = "asc",
): Application[] {
  return [...applications].sort((a, b) => {
    let result = 0

    if (sortMode === "nextEvent") {
      const aValue = getRelevantEventSortValue(a)
      const bValue = getRelevantEventSortValue(b)
      if (aValue !== bValue) {
        result = aValue - bValue
      } else {
        result = (b.selectionPhase || 0) - (a.selectionPhase || 0)
      }
    } else if (sortMode === "stage") {
      const aPhase = a.selectionPhase || 0
      const bPhase = b.selectionPhase || 0
      if (aPhase !== bPhase) {
        result = bPhase - aPhase
      } else {
        result = getRelevantEventSortValue(a) - getRelevantEventSortValue(b)
      }
    } else if (sortMode === "archived") {
      result = getRelevantEventSortValue(b) - getRelevantEventSortValue(a)
    }

    return sortDirection === "desc" ? -result : result
  })
}

export function sortEventsByStartTime<T extends { startTime?: string }>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aTime = parseTimeToMinutes(a.startTime) ?? 9999
    const bTime = parseTimeToMinutes(b.startTime) ?? 9999
    return aTime - bTime
  })
}
