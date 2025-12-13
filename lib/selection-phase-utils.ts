import type { Database } from './types/database'

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
      
    default:
      return null
  }
}
