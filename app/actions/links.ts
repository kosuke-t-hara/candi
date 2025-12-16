'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Application Links
export async function addApplicationLink(applicationId: string, url: string, label?: string) {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get current max sort_order
  const { count } = await (await supabase)
    .from('application_links')
    .select('*', { count: 'exact', head: true })
    .eq('application_id', applicationId)

  const sort_order = (count || 0) + 1

  const { error } = await (await supabase as any).from('application_links').insert({
    user_id: user.id,
    application_id: applicationId,
    url,
    label: label || null,
    sort_order
  })

  if (error) {
    if (error.message.includes('Maximum 5 links')) {
      throw new Error('Maximum 5 links allowed')
    }
    throw error
  }

  revalidatePath('/')
}

export async function deleteApplicationLink(linkId: string) {
  const supabase = createClient()
  const { error } = await (await supabase as any).from('application_links').delete().eq('id', linkId)
  if (error) throw error
  revalidatePath('/')
}

// Event Links
export async function addEventLink(eventId: string, url: string, label?: string) {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { count } = await (await supabase)
    .from('application_event_links')
    .select('*', { count: 'exact', head: true })
    .eq('application_event_id', eventId)

  const sort_order = (count || 0) + 1

  const { error } = await (await supabase as any).from('application_event_links').insert({
    user_id: user.id,
    application_event_id: eventId,
    url,
    label: label || null,
    sort_order
  })

  if (error) {
    if (error.message.includes('Maximum 5 links')) {
      throw new Error('Maximum 5 links allowed')
    }
    throw error
  }

  revalidatePath('/')
}

export async function deleteEventLink(linkId: string) {
  const supabase = createClient()
  const { error } = await (await supabase as any).from('application_event_links').delete().eq('id', linkId)
  if (error) throw error
  revalidatePath('/')
}
