'use client'

import { useState, useTransition } from 'react'

interface AuthFormProps {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; message?: string } | void>
  children: React.ReactNode
  submitText: string
}

export function AuthForm({ action, children, submitText }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      try {
        const result = await action(formData)
        
        // If action returns void, it means redirect happened (success)
        if (!result) {
          return
        }
        
        if (result.error) {
          setError(result.error)
        } else if (result.success) {
          setSuccess(result.message || 'Success!')
        }
      } catch (err) {
        // Redirect throws, so we ignore it
        // If it's a real error, it will be caught by error boundary
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {children}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Processing...' : submitText}
      </button>
    </form>
  )
}

