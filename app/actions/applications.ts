'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'
import { deriveSelectionPhase } from '@/lib/selection-phase-utils'

export async function getApplications() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('applications')
    .select('*, events:application_events(*, links:application_event_links(*)), links:application_links(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  // Fetch latest Toro entry for each application to show in the "Memo" column
  const { data: toroEntries } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('created_at', { ascending: false }) as { data: any[] | null }

  const applicationsWithMemos = data.map(app => {
    const latestMemo = toroEntries?.find(entry => 
      entry.context && typeof entry.context === 'object' && entry.context.applicationId === app.id
    )
    return {
      ...app,
      latest_memo: latestMemo?.content || null
    }
  })

  return applicationsWithMemos
}

export async function createApplication(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const company_name = formData.get('company_name') as string
  const position_title = formData.get('position_title') as string
  const source = formData.get('source') as Database['public']['Tables']['applications']['Row']['source']
  const stage = formData.get('stage') as Database['public']['Tables']['applications']['Row']['stage']
  const status_note = formData.get('status_note') as string
  
  const newApplication: Database['public']['Tables']['applications']['Insert'] = {
    user_id: user.id,
    company_name,
    position_title,
    source: source || 'direct',
    stage: stage || 'research',
    status_note,
    selection_phase: deriveSelectionPhase(stage || 'research'),
  }
  
  const { data, error } = await (supabase as any).from('applications').insert(newApplication).select().single()

  if (error) {
    console.error('Error creating application:', error)
    throw new Error('Failed to create application')
  }

  revalidatePath('/')
  return data
}

export async function updateApplicationStage(id: string, stage: Database['public']['Tables']['applications']['Row']['stage']) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('applications')
    .update({ 
      stage,
      selection_phase: deriveSelectionPhase(stage)
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating application stage:', error)
    throw new Error('Failed to update application stage')
  }

  revalidatePath('/')
}

export async function updateApplication(id: string, data: Database['public']['Tables']['applications']['Update']) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('applications')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Error updating application:', error)
    throw new Error('Failed to update application')
  }

  revalidatePath('/')
}
