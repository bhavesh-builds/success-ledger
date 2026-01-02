'use server'

import { requireAuth } from '@/lib/supabase/auth'
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '@/lib/supabase/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAchievementAction(formData: FormData) {
  const user = await requireAuth()

  const rawText = formData.get('rawText') as string
  const date = formData.get('date') as string
  const category = formData.get('category') as string | null
  const tags = formData.get('tags') as string | null

  if (!rawText || !date) {
    return {
      error: 'Raw text and date are required',
    }
  }

  const tagsArray = tags
    ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : []

  const { data, error } = await createAchievement({
    user_id: user.id,
    raw_text: rawText,
    date,
    category: category || null,
    tags: tagsArray,
    is_structured: false,
  })

  if (error) {
    return {
      error: error.message || 'Failed to create achievement',
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/achievements')
  redirect('/dashboard')
}

export async function updateAchievementActionWithId(
  id: string,
  formData: FormData
) {
  return updateAchievementAction(id, formData)
}

export async function updateAchievementAction(
  id: string,
  formData: FormData
) {
  const user = await requireAuth()

  const rawText = formData.get('rawText') as string
  const starSituation = formData.get('starSituation') as string | null
  const starTask = formData.get('starTask') as string | null
  const starAction = formData.get('starAction') as string | null
  const starResult = formData.get('starResult') as string | null
  const date = formData.get('date') as string
  const category = formData.get('category') as string | null
  const tags = formData.get('tags') as string | null

  if (!rawText || !date) {
    return {
      error: 'Raw text and date are required',
    }
  }

  const tagsArray = tags
    ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : []

  const isStructured = !!(starSituation && starTask && starAction && starResult)

  const { data, error } = await updateAchievement(
    id,
    user.id,
    {
      raw_text: rawText,
      star_situation: starSituation || null,
      star_task: starTask || null,
      star_action: starAction || null,
      star_result: starResult || null,
      date,
      category: category || null,
      tags: tagsArray,
      is_structured: isStructured,
    }
  )

  if (error) {
    return {
      error: error.message || 'Failed to update achievement',
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/achievements')
  revalidatePath(`/dashboard/achievements/${id}`)
  redirect('/dashboard/achievements')
}

export async function deleteAchievementAction(id: string) {
  const user = await requireAuth()

  const { error } = await deleteAchievement(id, user.id)

  if (error) {
    return {
      error: error.message || 'Failed to delete achievement',
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/achievements')
  redirect('/dashboard/achievements')
}

