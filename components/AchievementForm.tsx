'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'

interface AchievementFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>
  children: React.ReactNode
  submitText: string
  cancelHref?: string
}

export function AchievementForm({
  action,
  children,
  submitText,
  cancelHref,
}: AchievementFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)

    startTransition(async () => {
      try {
        const result = await action(formData)

        // If action returns void, it means redirect happened (success)
        if (!result) {
          return
        }

        if (result.error) {
          setError(result.error)
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

      {children}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : submitText}
        </button>
        {cancelHref && (
          <Link
            href={cancelHref}
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}

