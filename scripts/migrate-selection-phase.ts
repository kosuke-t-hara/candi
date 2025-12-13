import { createClient } from '@/lib/supabase/server'
import { deriveSelectionPhase } from '@/lib/selection-phase-utils'

/**
 * Migration script to update selection_phase for all existing applications
 * Run this once after adding the selection_phase column
 */
export async function migrateSelectionPhase() {
  const supabase = await createClient()
  
  const { data: applications, error: fetchError } = await supabase
    .from('applications')
    .select('id, stage')
  
  if (fetchError) {
    console.error('Error fetching applications:', fetchError)
    throw new Error('Failed to fetch applications')
  }
  
  if (!applications || applications.length === 0) {
    console.log('No applications to migrate')
    return
  }
  
  console.log(`Migrating ${applications.length} applications...`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const app of applications) {
    const phase = deriveSelectionPhase(app.stage)
    
    const { error: updateError } = await (supabase as any)
      .from('applications')
      .update({ selection_phase: phase })
      .eq('id', app.id)
    
    if (updateError) {
      console.error(`Error updating application ${app.id}:`, updateError)
      errorCount++
    } else {
      successCount++
    }
  }
  
  console.log(`Migration complete: ${successCount} succeeded, ${errorCount} failed`)
  
  return { successCount, errorCount, total: applications.length }
}
