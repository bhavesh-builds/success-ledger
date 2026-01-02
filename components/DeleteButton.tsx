'use client'

import { useState, useTransition } from 'react'
import { deleteAchievementAction } from '@/app/actions/achievements'
import { useRouter } from 'next/navigation'

export function DeleteButton({ achievementId }: { achievementId: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    startTransition(async () => {
      try {
        const result = await deleteAchievementAction(achievementId)
        if (result?.error) {
          setError(result.error)
          setShowConfirm(false)
          return
        }
        // Server action redirects, but we'll navigate to be safe
        router.push('/dashboard/achievements')
        router.refresh()
      } catch (err) {
        // Redirect throws, so we catch it and navigate manually
        router.push('/dashboard/achievements')
        router.refresh()
      }
    })
  }

  if (showConfirm) {
    return (
      <div className="space-y-3">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Deleting...' : 'Confirm Delete'}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false)
              setError(null)
            }}
            disabled={isPending}
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
    >
      Delete
    </button>
  )
}

