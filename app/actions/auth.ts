'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    }
  }

  if (password.length < 6) {
    return {
      error: 'Password must be at least 6 characters',
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  // Profile is automatically created by the trigger function
  // But we can verify it exists
  // If email confirmation is required, user will need to confirm email first
  // Otherwise, redirect to dashboard
  if (data.user && data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Email confirmation required
  return {
    success: true,
    message: 'Check your email to confirm your account',
  }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  if (data.user) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return {
    success: true,
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

