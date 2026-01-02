import { createClient } from './server'
import type { Database } from './types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
type AchievementUpdate = Database['public']['Tables']['achievements']['Update']

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

type Share = Database['public']['Tables']['shares']['Row']
type ShareInsert = Database['public']['Tables']['shares']['Insert']

type Comment = Database['public']['Tables']['comments']['Row']
type CommentInsert = Database['public']['Tables']['comments']['Insert']
type CommentUpdate = Database['public']['Tables']['comments']['Update']

type Like = Database['public']['Tables']['likes']['Row']
type LikeInsert = Database['public']['Tables']['likes']['Insert']

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
    // @ts-expect-error - Supabase type inference issue with Database types
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
    // @ts-expect-error - Supabase type inference issue with Database types
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
    // @ts-expect-error - Supabase type inference issue with Database types
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
    // @ts-expect-error - Supabase type inference issue with Database types
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
  const { data: share } = await (supabase
    .from('shares')
    .select('achievement_id, achievements!inner(user_id)')
    .eq('id', shareId)
    .single() as any)

  if (!share || (share?.achievements as any)?.user_id !== userId) {
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

/**
 * Comment operations
 */
export async function getComments(achievementId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('achievement_id', achievementId)
    .is('parent_id', null) // Only top-level comments
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return { data: null, error }
  }

  // Fetch profiles separately if we have comments
  if (data && Array.isArray(data) && data.length > 0) {
    const commentsData = data as Comment[]
    const userIds = [...new Set(commentsData.map((comment) => comment.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    // Map profiles to comments
    const profilesMap = new Map(
      (profiles || []).map((profile: any) => [profile.id, profile])
    )

    const commentsWithProfiles = commentsData.map((comment) => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null,
    })) as Array<Comment & {
      profiles: {
        full_name: string | null
        avatar_url: string | null
      } | null
    }>

    return { data: commentsWithProfiles, error: null }
  }

  // Return empty array with correct type
  return { 
    data: [] as Array<Comment & {
      profiles: {
        full_name: string | null
        avatar_url: string | null
      } | null
    }>, 
    error: null 
  }
}

export async function getCommentReplies(parentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comment replies:', error)
    return { data: null, error }
  }

  // Fetch profiles separately if we have replies
  if (data && Array.isArray(data) && data.length > 0) {
    const repliesData = data as Comment[]
    const userIds = [...new Set(repliesData.map((comment) => comment.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    // Map profiles to comments
    const profilesMap = new Map(
      (profiles || []).map((profile: any) => [profile.id, profile])
    )

    const repliesWithProfiles = repliesData.map((comment) => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null,
    }))

    return { data: repliesWithProfiles, error: null }
  }

  return { data: (data as Comment[]) || [], error: null }
}

export async function createComment(comment: CommentInsert) {
  const supabase = await createClient()
  
  console.log('Creating comment with data:', {
    achievement_id: comment.achievement_id,
    user_id: comment.user_id,
    content_length: comment.content?.length,
    parent_id: comment.parent_id,
  })
  
  const { data, error } = await supabase
    .from('comments')
    // @ts-expect-error - Supabase type inference issue with Database types
    .insert(comment)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return { data: null, error }
  }
  
  if (data) {
    console.log('Comment created successfully:', (data as any).id)
  }

  // Fetch profile if we have data
  if (data) {
    const commentData = data as any as Comment
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', commentData.user_id)
      .single()

    return {
      data: {
        ...commentData,
        profiles: profile || null,
      } as any,
      error: null,
    }
  }

  return { data, error: null }
}

export async function updateComment(id: string, userId: string, updates: CommentUpdate) {
  const supabase = await createClient()
  const query = supabase
    .from('comments')
    // @ts-expect-error - Supabase type inference issue with Database types
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()
  const { data, error } = await (query as any)

  if (error) {
    console.error('Error updating comment:', error)
    return { data: null, error }
  }

  // Fetch profile if we have data
  if (data) {
    const commentData = data as any as Comment
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', commentData.user_id)
      .single()

    return {
      data: {
        ...commentData,
        profiles: profile || null,
      } as any,
      error: null,
    }
  }

  return { data, error: null }
}

export async function deleteComment(id: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error }
  }

  return { error: null }
}

export async function getCommentCount(achievementId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('achievement_id', achievementId)

  if (error) {
    console.error('Error getting comment count:', error)
    return { count: 0, error }
  }

  return { count: count || 0, error: null }
}

/**
 * Like operations
 */
export async function getLikes(achievementId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('achievement_id', achievementId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching likes:', error)
    return { data: null, error }
  }

  // Fetch profiles separately if we have likes
  if (data && Array.isArray(data) && data.length > 0) {
    const likesData = data as Like[]
    const userIds = [...new Set(likesData.map((like) => like.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    // Map profiles to likes
    const profilesMap = new Map(
      (profiles || []).map((profile: any) => [profile.id, profile])
    )

    const likesWithProfiles = likesData.map((like) => ({
      ...like,
      profiles: profilesMap.get(like.user_id) || null,
    }))

    return { data: likesWithProfiles, error: null }
  }

  return { data: (data as Like[]) || [], error: null }
}

export async function createLike(like: LikeInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('likes')
    // @ts-expect-error - Supabase type inference issue with Database types
    .insert(like)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating like:', error)
    return { data: null, error }
  }

  // Fetch profile if we have data
  if (data) {
    const likeData = data as any as Like
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', likeData.user_id)
      .single()

    return {
      data: {
        ...likeData,
        profiles: profile || null,
      } as any,
      error: null,
    }
  }

  return { data, error: null }
}

export async function deleteLike(achievementId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('achievement_id', achievementId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting like:', error)
    return { error }
  }

  return { error: null }
}

export async function hasUserLiked(achievementId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('achievement_id', achievementId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" which is fine
    console.error('Error checking like:', error)
    return { hasLiked: false, error }
  }

  return { hasLiked: !!data, error: null }
}

export async function getLikeCount(achievementId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('achievement_id', achievementId)

  if (error) {
    console.error('Error getting like count:', error)
    return { count: 0, error }
  }

  return { count: count || 0, error: null }
}

