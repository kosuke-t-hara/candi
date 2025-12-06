'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

export async function getGrowthLogs() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('growth_logs')
    .select('*')
    .order('starts_at', { ascending: false })

  if (error) {
    console.error('Error fetching growth logs:', error)
    return []
  }

  return data
}

export async function createGrowthLog(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const title = formData.get('title') as string
  const category = formData.get('category') as Database['public']['Tables']['growth_logs']['Row']['category']
  const starts_at = formData.get('starts_at') as string
  
  const newLog: Database['public']['Tables']['growth_logs']['Insert'] = {
    user_id: user.id,
    title,
    category,
    starts_at,
    source: 'manual',
  }

  const { error } = await (supabase as any).from('growth_logs').insert(newLog)

  if (error) {
    console.error('Error creating growth log:', error)
    throw new Error('Failed to create growth log')
  }

  revalidatePath('/')
}
