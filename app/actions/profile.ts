'use server'

import { requireAuth } from '@/lib/supabase/auth'
import { updateProfile } from '@/lib/supabase/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfileAction(formData: FormData) {
  const user = await requireAuth()

  const fullName = formData.get('fullName') as string
  const bio = formData.get('bio') as string
  const jobTitle = formData.get('jobTitle') as string
  const company = formData.get('company') as string
  const location = formData.get('location') as string
  const website = formData.get('website') as string

  const { data, error } = await updateProfile(user.id, {
    full_name: fullName || null,
    bio: bio || null,
    job_title: jobTitle || null,
    company: company || null,
    location: location || null,
    website: website || null,
  })

  if (error) {
    return {
      error: error.message || 'Failed to update profile',
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  redirect('/dashboard')
}

