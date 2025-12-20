'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createToroEntry(content: string) {
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

export async function getToroEntries() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await (supabase as any)
    .from('toro_entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching toro entries:', error)
    return []
  }

  return data
}
