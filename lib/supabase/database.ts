import { createClient } from './server'
import type { Database } from './types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
type AchievementUpdate = Database['public']['Tables']['achievements']['Update']

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

type Share = Database['public']['Tables']['shares']['Row']
type ShareInsert = Database['public']['Tables']['shares']['Insert']

/**
 * Achievement operations
 */
export async function getAchievements(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching achievements:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getAchievementById(id: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching achievement:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createAchievement(achievement: AchievementInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievement)
    .select()
    .single()

  if (error) {
    console.error('Error creating achievement:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateAchievement(
  id: string,
  userId: string,
  updates: AchievementUpdate
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating achievement:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function deleteAchievement(id: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting achievement:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Profile operations
 */
export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Share operations
 */
export async function createShare(share: ShareInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shares')
    .insert(share)
    .select()
    .single()

  if (error) {
    console.error('Error creating share:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getShareByToken(token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shares')
    .select('*, achievements(*)')
    .eq('share_token', token)
    .single()

  if (error) {
    console.error('Error fetching share:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function deleteShare(shareId: string, userId: string) {
  const supabase = await createClient()
  
  // First verify the share belongs to an achievement owned by the user
  const { data: share } = await supabase
    .from('shares')
    .select('achievement_id, achievements!inner(user_id)')
    .eq('id', shareId)
    .single()

  if (!share || (share.achievements as any).user_id !== userId) {
    return { error: { message: 'Unauthorized' } }
  }

  const { error } = await supabase
    .from('shares')
    .delete()
    .eq('id', shareId)

  if (error) {
    console.error('Error deleting share:', error)
    return { error }
  }

  return { error: null }
}

