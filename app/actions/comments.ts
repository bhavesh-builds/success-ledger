'use server'

import { requireAuth } from '@/lib/supabase/auth'
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from '@/lib/supabase/database'
import { revalidatePath } from 'next/cache'

export async function createCommentAction(
  achievementId: string,
  content: string,
  parentId?: string | null
) {
  const user = await requireAuth()

  if (!content.trim()) {
    return {
      error: 'Comment content is required',
    }
  }

  const { data, error } = await createComment({
    achievement_id: achievementId,
    user_id: user.id,
    content: content.trim(),
    parent_id: parentId || null,
  })

  if (error) {
    console.error('Error creating comment:', error)
    return {
      error: error.message || 'Failed to create comment',
    }
  }

  if (!data) {
    console.error('No data returned from createComment')
    return {
      error: 'Failed to create comment - no data returned',
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { data, error: null }
}

export async function updateCommentAction(
  commentId: string,
  achievementId: string,
  content: string
) {
  const user = await requireAuth()

  if (!content.trim()) {
    return {
      error: 'Comment content is required',
    }
  }

  const { data, error } = await updateComment(commentId, user.id, {
    content: content.trim(),
  })

  if (error) {
    return {
      error: error.message || 'Failed to update comment',
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { data, error: null }
}

export async function deleteCommentAction(
  commentId: string,
  achievementId: string
) {
  const user = await requireAuth()

  const { error } = await deleteComment(commentId, user.id)

  if (error) {
    return {
      error: error.message || 'Failed to delete comment',
    }
  }

  revalidatePath(`/dashboard/achievements/${achievementId}`)
  return { error: null }
}

