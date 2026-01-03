'use client'

import { useState, useTransition } from 'react'
import { toggleLikeAction } from '@/app/actions/likes'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  achievementId: string
  initialLikeCount: number
  initialHasLiked: boolean
}

export function LikeButton({
  achievementId,
  initialLikeCount,
  initialHasLiked,
}: LikeButtonProps) {
  const router = useRouter()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleToggleLike() {
    setError(null)
    startTransition(async () => {
      const result = await toggleLikeAction(achievementId)
      if (result?.error) {
        setError(result.error)
        return
      }
      // Optimistically update UI
      setHasLiked(!hasLiked)
      setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleLike}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          hasLiked
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        }`}
      >
        <svg
          className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`}
          fill={hasLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{likeCount}</span>
        {isPending && <span className="text-xs">...</span>}
      </button>
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </div>
  )
}


