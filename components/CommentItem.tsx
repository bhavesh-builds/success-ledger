'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { deleteCommentAction, updateCommentAction } from '@/app/actions/comments'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/supabase/types'

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface CommentItemProps {
  comment: Comment
  achievementId: string
  currentUserId: string
}

export function CommentItem({ comment, achievementId, currentUserId }: CommentItemProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isOwner = comment.user_id === currentUserId
  const authorName = comment.profiles?.full_name || 'Anonymous'

  async function handleUpdate() {
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await updateCommentAction(comment.id, achievementId, content)
      if (result?.error) {
        setError(result.error)
        return
      }
      setIsEditing(false)
      router.refresh()
    })
  }

  async function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteCommentAction(comment.id, achievementId)
      if (result?.error) {
        setError(result.error)
        setShowDeleteConfirm(false)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {authorName}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setContent(comment.content)
                    setError(null)
                  }}
                  disabled={isPending}
                  className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {comment.content}
              </p>
              {isOwner && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  {showDeleteConfirm ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                      >
                        {isPending ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}


