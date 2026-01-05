'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

export async function getEvents(applicationId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('application_events')
    .select('*, links:application_event_links(*)')
    .eq('application_id', applicationId)
    .order('starts_at', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data
}

import { deriveAppUpdateFromEvent, deriveStatusFromEvents } from '@/lib/selection-phase-utils'
import { updateApplication } from '@/app/actions/applications'

export async function createEvent(applicationId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const title = formData.get('title') as string
  const kind = formData.get('kind') as Database['public']['Tables']['application_events']['Row']['kind']
  const starts_at = formData.get('starts_at') as string
  const ends_at = formData.get('ends_at') as string | null
  const outcome = formData.get('outcome') as Database['public']['Tables']['application_events']['Row']['outcome'] | null
  const status = formData.get('status') as string | null
  const notes = formData.get('notes') as string | null
  
  const { data: newEvent, error } = await (supabase as any).from('application_events').insert({
    user_id: user.id,
    application_id: applicationId,
    title,
    kind: kind || 'other',
    starts_at,
    ends_at: ends_at || null,
    outcome: (formData.get('status') === 'candidate' ? 'unknown' : (outcome || 'scheduled')),
    notes: notes || null,
  }).select().single()

  if (error) {
    console.error('Error creating event:', error)
    throw new Error('Failed to create event')
  }

  // Automatically update application stage if needed
  if (kind) {
    const update = deriveAppUpdateFromEvent(kind)
    if (update) {
      // Fetch current application to compare
      const { data: currentApp } = await (supabase as any)
        .from('applications')
        .select('selection_phase, stage')
        .eq('id', applicationId)
        .single()
      
      const shouldUpdate = 
        currentApp && 
        (currentApp.selection_phase < update.selection_phase || 
         update.stage === 'rejected' || 
         update.stage === 'withdrawn' ||
         update.stage === 'accepted')

      if (shouldUpdate) {
        const isArchived = update.stage === 'rejected' || update.stage === 'withdrawn' || update.stage === 'accepted'
        await updateApplication(applicationId, {
          stage: update.stage,
          selection_phase: isArchived ? currentApp.selection_phase : update.selection_phase,
          archived: isArchived
        })
      }
    }
  }

  revalidatePath('/')
  return newEvent
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const title = formData.get('title') as string
  const kind = formData.get('kind') as Database['public']['Tables']['application_events']['Row']['kind']
  const starts_at = formData.get('starts_at') as string
  const ends_at = formData.get('ends_at') as string | null
  const outcome = formData.get('outcome') as Database['public']['Tables']['application_events']['Row']['outcome'] | null
  const status = formData.get('status') as string | null
  const notes = formData.get('notes') as string | null
  
  const { data, error } = await (supabase as any).from('application_events').update({
    title,
    kind: kind || 'other',
    starts_at,
    ends_at: ends_at || null,
    outcome: (formData.get('status') === 'candidate' ? 'unknown' : (outcome || 'scheduled')),
    notes: notes || null,
  }).eq('id', eventId)
  .select('application_id')
  .single()

  if (error) {
    console.error('Error updating event:', error)
    throw new Error('Failed to update event')
  }

  // Automatically update application stage if needed
  if (kind && data?.application_id) {
    const applicationId = data.application_id
    const update = deriveAppUpdateFromEvent(kind)
    if (update) {
       // Fetch current application to compare
       const { data: currentApp } = await (supabase as any)
       .from('applications')
       .select('selection_phase, stage')
       .eq('id', applicationId)
       .single()
     
     const shouldUpdate = 
       currentApp && 
       (currentApp.selection_phase < update.selection_phase || 
        update.stage === 'rejected' || 
        update.stage === 'withdrawn' ||
        update.stage === 'accepted')

     if (shouldUpdate) {
        const isArchived = update.stage === 'rejected' || update.stage === 'withdrawn' || update.stage === 'accepted'
       await updateApplication(applicationId, {
         stage: update.stage,
         selection_phase: isArchived ? currentApp.selection_phase : update.selection_phase,
         archived: isArchived
       })
     }
    }
  }

  revalidatePath('/')
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data: deletedEvent, error } = await (supabase as any)
    .from('application_events')
    .delete()
    .eq('id', eventId)
    .select('application_id')
    .single()

  if (error) {
    console.error('Error deleting event:', error)
    throw new Error('Failed to delete event')
  }

  // Recalculate and sync application status
  if (deletedEvent?.application_id) {
    const applicationId = deletedEvent.application_id
    
    const { data: remainingEvents } = await (supabase as any)
      .from('application_events')
      .select('kind')
      .eq('application_id', applicationId)
    
    if (remainingEvents) {
      const newStatus = deriveStatusFromEvents(remainingEvents)
      await updateApplication(applicationId, {
        stage: newStatus.stage,
        selection_phase: newStatus.selection_phase,
        archived: newStatus.archived
      })
    }
  }

  revalidatePath('/')
}
