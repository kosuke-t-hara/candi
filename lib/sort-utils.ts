import type { Application } from "./mock-data"

export type SortMode = "nextEvent" | "stage" | "myBall" | "archived"
export type SortDirection = "asc" | "desc"

const stageOrder = ["ヘッドハンター面談", "カジュアル面談", "書類選考", "一次面接", "二次面接", "最終面接"] as const

const statusOrderForMyBall = ["こっちボール", "調整中", "企業ボール", "確定"] as const

export function parseTimeToMinutes(time: string | undefined): number | null {
  if (!time) return null
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  return hours * 60 + minutes
}

export function parseDateToValue(dateStr: string | undefined): number | null {
  if (!dateStr) return null

  // Handle "YYYY-MM-DD" format
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const year = Number.parseInt(isoMatch[1], 10)
    const month = Number.parseInt(isoMatch[2], 10)
    const day = Number.parseInt(isoMatch[3], 10)
    return year * 10000 + month * 100 + day
  }

  // Handle "MM/DD（曜）" format
  const jpMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})/)
  if (jpMatch) {
    const month = Number.parseInt(jpMatch[1], 10)
    const day = Number.parseInt(jpMatch[2], 10)
    return 2025 * 10000 + month * 100 + day
  }

  return null
}

export function getDateTimeSortValue(app: Application): number {
  const dateValue = parseDateToValue(app.scheduledDate) ?? Number.MAX_SAFE_INTEGER
  const timeValue = parseTimeToMinutes(app.startTime) ?? 9999 // No time = end of day
  return dateValue * 10000 + timeValue
}

export function sortApplications(
  applications: Application[],
  sortMode: SortMode,
  sortDirection: SortDirection = "asc",
): Application[] {
  return [...applications].sort((a, b) => {
    let result = 0

    if (sortMode === "nextEvent") {
      const aValue = getDateTimeSortValue(a)
      const bValue = getDateTimeSortValue(b)
      result = aValue - bValue
    } else if (sortMode === "stage") {
      const aStageIndex = stageOrder.indexOf(a.stage as any)
      const bStageIndex = stageOrder.indexOf(b.stage as any)
      const ai = aStageIndex === -1 ? Number.MAX_SAFE_INTEGER : aStageIndex
      const bi = bStageIndex === -1 ? Number.MAX_SAFE_INTEGER : bStageIndex
      if (ai !== bi) {
        result = ai - bi
      } else {
        const aStatusIndex = statusOrderForMyBall.indexOf(a.status as any)
        const bStatusIndex = statusOrderForMyBall.indexOf(b.status as any)
        const asi = aStatusIndex === -1 ? statusOrderForMyBall.length : aStatusIndex
        const bsi = bStatusIndex === -1 ? statusOrderForMyBall.length : bStatusIndex
        if (asi !== bsi) result = asi - bsi
        else result = 0
      }
    } else if (sortMode === "myBall") {
      const aStatusIndex = statusOrderForMyBall.indexOf(a.status as any)
      const bStatusIndex = statusOrderForMyBall.indexOf(b.status as any)
      const asi = aStatusIndex === -1 ? statusOrderForMyBall.length : aStatusIndex
      const bsi = bStatusIndex === -1 ? statusOrderForMyBall.length : bStatusIndex
      if (asi !== bsi) {
        result = asi - bsi
      } else {
        const aValue = getDateTimeSortValue(a)
        const bValue = getDateTimeSortValue(b)
        result = aValue - bValue
      }
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
