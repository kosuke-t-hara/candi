import type { Database } from './types/database'
import type { ApplicationEvent } from './mock-data'

/**
 * Derives the selection phase (1-5) from the application stage
 * 
 * Phase definitions:
 * 1: Research / Pre-application (research)
 * 2: Applied / Document screening (applied, screening)
 * 3: Interviewing (interviewing)
 * 4: Final phase / Offer negotiation (final, negotiating)
 * 5: Offer confirmed / Accepted (offered)
 */
export function deriveSelectionPhase(
  stage: Database['public']['Tables']['applications']['Row']['stage']
): number {
  switch (stage) {
    case 'research':
      return 1
    
    case 'applied':
    case 'screening':
      return 2
    
    case 'interviewing':
      return 3
    
    case 'accepted':
    case 'offered':
      return 5
    
    case 'rejected':
    case 'withdrawn':
      // For rejected/withdrawn, return the last phase they reached
      // This could be enhanced to track the actual phase they were in
      return 1
    
    default:
      return 1
  }
}

/**
 * Get a human-readable label for the selection phase
 */
export function getSelectionPhaseLabel(phase: number): string {
  switch (phase) {
    case 1:
      return '情報収集中'
    case 2:
      return '書類選考中'
    case 3:
      return '面接中'
    case 4:
      return '最終調整中'
    case 5:
      return 'オファー確定'
    default:
      return '不明'
  }
}

/**
 * Get a human-readable Japanese label for the application stage
 */
export function getStageLabel(stage: string): string {
  switch (stage) {
    case 'research':
      return '情報収集中'
    case 'applied':
      return '応募済み'
    case 'screening':
      return '書類選考'
    case 'interviewing':
      return '面接中'
    case 'offered':
      return '内定'
    case 'accepted':
      return '内定受諾'
    case 'rejected':
      return 'お見送り'
    case 'withdrawn':
      return '辞退'
    default:
      return stage
  }
}

/**
 * Derives the potential application stage and selection phase update based on the event type.
 * Returns null if no update is implied.
 */
export function deriveAppUpdateFromEvent(eventKind: string): { 
  stage: Database['public']['Tables']['applications']['Row']['stage'], 
  selection_phase: number 
} | null {
  switch (eventKind) {
    case 'casual_talk':
      // Usually signifies start of research/contact
      return { stage: 'research', selection_phase: 1 }
    
    case 'screening_call':
      return { stage: 'screening', selection_phase: 2 }
    
    case 'interview_1st':
    case 'interview_2nd':
    case 'interview_3rd':
      return { stage: 'interviewing', selection_phase: 3 }
    
    case 'interview_final':
      // Final interview is still 'interviewing' stage but specifically phase 4
      return { stage: 'interviewing', selection_phase: 4 }
    
    case 'offer_meeting':
      // Offer interview usually implies reaching the final/offer stage.
      // We map this to 'offered' (Phase 5) to signify the milestone.
      return { stage: 'offered', selection_phase: 5 }

    case 'aptitude_test':
      return { stage: 'screening', selection_phase: 2 }

    case 'offer_accepted':
      return { stage: 'accepted', selection_phase: 5 }

    case 'rejected':
      return { stage: 'rejected', selection_phase: 1 }

    case 'withdrawn':
      return { stage: 'withdrawn', selection_phase: 1 }
      
    default:
      return null
  }
}

/**
 * Derives the overall application status from a list of events.
 * Used when recalculating status after event deletion.
 */
export function deriveStatusFromEvents(events: Array<{ kind: string }>): {
  stage: Database['public']['Tables']['applications']['Row']['stage'],
  selection_phase: number,
  archived: boolean
} {
  // Check for rejection/withdrawal first
  // We prioritize the most recent termination if valid, or just presence.
  // Simple logic: if ANY rejected/withdrawn/offer_accepted exists, the app is closed.
  const terminationEvent = events.find(e => e.kind === 'rejected' || e.kind === 'withdrawn' || e.kind === 'offer_accepted')
  
  if (terminationEvent) {
    // If terminated, we want to know the max phase reached to preserve the indicator.
    const maxPhase = events.reduce((max, e) => {
        const update = deriveAppUpdateFromEvent(e.kind)
        // Ignore termination events for phase calculation to report "progress before termination"
        if (update && e.kind !== 'rejected' && e.kind !== 'withdrawn' && e.kind !== 'offer_accepted') {
            return Math.max(max, update.selection_phase)
        }
        return max
    }, 1)

    return {
        stage: terminationEvent.kind as any,
        selection_phase: maxPhase,
        archived: true
    }
  }

  // Calculate max phase from active events
  let maxPhase = 1
  let maxStage: Database['public']['Tables']['applications']['Row']['stage'] = 'research' // default

  events.forEach(e => {
        const update = deriveAppUpdateFromEvent(e.kind)
        if (update) {
            // Update if strictly greater? Or greater/equal?
            // If equal (e.g. multiple interviews), stage name is same ('interviewing').
            // Exception: 'interview_final' is phase 4. 'interview_1st' is phase 3.
            if (update.selection_phase > maxPhase) {
                maxPhase = update.selection_phase
                maxStage = update.stage
            }
        }
  })

  return {
    stage: maxStage,
    selection_phase: maxPhase,
    archived: false
  }
}

/**
 * Get the display label for the application card/row.
 * Logic:
 * 1. If there are future events, use the one closest to now (upcoming).
 * 2. If no future events, use the past event closest to now (most recent).
 * 3. Fallback to stage label if no events.
 */
export function getDisplayEventLabel(events: ApplicationEvent[], currentStage: string): string {
  if (!events || events.length === 0) {
    return getStageLabel(currentStage)
  }

  const now = new Date()
  
  // Helper to parse event date
  const parseEventDate = (e: ApplicationEvent) => {
    // combine date and startTime for precision, default to end of day if no time?
    // actually mock data has time.
    return new Date(`${e.date}T${e.startTime || '00:00'}`)
  }

  const sortedEvents = events.map(e => ({
    event: e,
    date: parseEventDate(e)
  })).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Find first future event
  const futureEvent = sortedEvents.find(item => item.date >= now)

  if (futureEvent) {
    return futureEvent.event.type
  }

  // If no future event, take the last one (most recent past)
  const lastEvent = sortedEvents[sortedEvents.length - 1]
  return lastEvent.event.type
}

/**
 * Derives the overall status label (確定/相手ボール) based on the most relevant event.
 */
export function getDisplayStatus(app: { events: ApplicationEvent[], applicationStatus: string, status: string }): { label: string, color: "green" | "yellow" | "gray" | "red" } {
  if (app.applicationStatus === "closed") {
    return { label: "終了", color: "gray" }
  }

  if (!app.events || app.events.length === 0) {
    // Fallback if no events
    if (app.status === "確定") return { label: "確定", color: "green" }
    return { label: "未定", color: "gray" }
  }

  const now = new Date()
  
  // Sort events by date to find the most relevant one
  const sortedEvents = [...app.events].map(e => ({
    event: e,
    date: new Date(`${e.date}T${e.startTime || '00:00'}`)
  })).sort((a, b) => a.date.getTime() - b.date.getTime())

  // Find first future event or last past event (mirrors getDisplayEventLabel)
  const futureEventItem = sortedEvents.find(item => item.date >= now)
  const relevantEvent = futureEventItem ? futureEventItem.event : sortedEvents[sortedEvents.length - 1].event

  // Look at outcome to determine if it's confirmed or adjustment
  // Map 'unknown' outcome to 'adjustment' for now
  // @ts-ignore - outcome might not be in all event objects
  if (relevantEvent.outcome === "unknown") {
    return { label: "調整中", color: "yellow" }
  }

  // Otherwise, if outcome is scheduled, treat as confirmed
  // @ts-ignore
  if (relevantEvent.outcome === "scheduled" || relevantEvent.status === "confirmed") {
    return { label: "確定", color: "green" }
  }

  return { label: "調整中", color: "yellow" }
}
