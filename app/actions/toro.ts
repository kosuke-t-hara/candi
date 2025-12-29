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

  // Querying using JSON containment or matching on context field
  // context looks like { source: 'candi_application', applicationId: '...' }
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
