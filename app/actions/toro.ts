'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createToroEntry(content: string, context?: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .insert({
      user_id: user.id,
      content: content,
      context: context ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating toro entry:', error)
    throw new Error('Failed to create entry')
  }

  revalidatePath('/past')
  revalidatePath('/candi')
  return data
}

export async function getToroEntries(showArchived: boolean = false) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  let query = (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (showArchived) {
    query = query.not('archived_at', 'is', null)
  } else {
    query = query.is('archived_at', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching toro entries:', JSON.stringify(error, null, 2))
    return []
  }

  return data
}

export async function getApplicationToroEntries(applicationId: string, limit: number = 3) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  // context looks like { source: 'candi_application', applicationId: '...' }
  // or { source: 'candi_event', applicationId: '...', eventId: '...' }
  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', user.id)
    .contains('context', { applicationId })
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching application toro entries:', error)
    return []
  }

  return data
}

export async function getEventToroEntries(eventId: string, limit: number = 3) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', user.id)
    .contains('context', { eventId })
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching event toro entries:', error)
    return []
  }

  return data
}

export async function archiveToroEntry(id: string) {
  const supabase = await createClient()
  
  const { error } = await (supabase as any)
    .from('toro_entries')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error archiving entry:', error)
    throw new Error('Failed to archive entry')
  }

  revalidatePath('/past')
}

export async function unarchiveToroEntry(id: string) {
  const supabase = await createClient()
  
  const { error } = await (supabase as any)
    .from('toro_entries')
    .update({ archived_at: null })
    .eq('id', id)

  if (error) {
    console.error('Error unarchiving entry:', error)
    throw new Error('Failed to unarchive entry')
  }

  revalidatePath('/past')
}

export async function updateToroEntry(id: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .update({ 
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating toro entry:', error)
    throw new Error('Failed to update entry')
  }

  revalidatePath('/past')
  return data
}

export async function getLatestToroEntry() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', user.id)
    .is('context', null)
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
      console.error('Error fetching latest toro entry:', error)
    }
    return null
  }

  return data
}

export async function getLatestToroEntryByContext(context: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .eq('user_id', user.id)
    .contains('context', context)
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching latest toro entry by context:', error)
    }
    return null
  }

  return data
}
