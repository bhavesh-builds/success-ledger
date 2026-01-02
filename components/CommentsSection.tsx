'use client'

import { useState, useTransition } from 'react'
import { createCommentAction } from '@/app/actions/comments'
import { CommentItem } from './CommentItem'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/supabase/types'

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface CommentsSectionProps {
  achievementId: string
  comments: Comment[]
  currentUserId: string
}

export function CommentsSection({
  achievementId,
  comments,
  currentUserId,
}: CommentsSectionProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const result = await createCommentAction(achievementId, content)
        if (result?.error) {
          setError(result.error)
          console.error('Comment creation error:', result.error)
          return
        }
        setContent('')
        router.refresh()
      } catch (err) {
        console.error('Unexpected error creating comment:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              achievementId={achievementId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

