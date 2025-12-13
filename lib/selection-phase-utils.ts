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
