'use server'

import { requireAuth } from '@/lib/supabase/auth'
import { createLike, deleteLike, hasUserLiked } from '@/lib/supabase/database'
import { revalidatePath } from 'next/cache'

export async function toggleLikeAction(achievementId: string) {
  const user = await requireAuth()

  // Check if user already liked
  const { hasLiked, error: checkError } = await hasUserLiked(achievementId, user.id)

  if (checkError) {
    return {
      error: checkError.message || 'Failed to check like status',
    }
  }

  if (hasLiked) {
    // Unlike
    const { error } = await deleteLike(achievementId, user.id)
    if (error) {
      return {
        error: error.message || 'Failed to unlike',
      }
    }
  } else {
    // Like
    const { error } = await createLike({
      achievement_id: achievementId,
      user_id: user.id,
    })
    if (error) {
      return {
        error: error.message || 'Failed to like',
      }
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { error: null }
}

export async function likeAction(achievementId: string) {
  const user = await requireAuth()

  const { error } = await createLike({
    achievement_id: achievementId,
    user_id: user.id,
  })

  if (error) {
    // If it's a unique constraint violation, user already liked it
    if (error.code === '23505') {
      return { error: null } // Already liked, treat as success
    }
    return {
      error: error.message || 'Failed to like',
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { error: null }
}

export async function unlikeAction(achievementId: string) {
  const user = await requireAuth()

  const { error } = await deleteLike(achievementId, user.id)

  if (error) {
    return {
      error: error.message || 'Failed to unlike',
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { error: null }
}

