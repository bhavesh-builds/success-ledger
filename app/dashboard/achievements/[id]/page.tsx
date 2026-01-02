import { requireAuth } from '@/lib/supabase/auth'
import { getAchievementById, getComments, getLikeCount, hasUserLiked } from '@/lib/supabase/database'
import { updateAchievementActionWithId, deleteAchievementAction } from '@/app/actions/achievements'
import type { Database } from '@/lib/supabase/types'
import Link from 'next/link'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import { DeleteButton } from '@/components/DeleteButton'
import { AchievementForm } from '@/components/AchievementForm'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'

type Achievement = Database['public']['Tables']['achievements']['Row']

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const user = await requireAuth()
    const { id } = await params
    
    if (!id) {
      redirect('/dashboard/achievements')
    }
    
    const { data: achievement, error } = await getAchievementById(id, user.id)

    if (error || !achievement) {
      redirect('/dashboard/achievements')
    }

    // Type assertion to ensure TypeScript knows the type
    const achievementData = achievement as Achievement

    // Fetch likes and comments
    const { count: likeCount } = await getLikeCount(id)
    const { hasLiked } = await hasUserLiked(id, user.id)
    const { data: comments } = await getComments(id)
    const commentsList = Array.isArray(comments) ? comments : []

    return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Success Ledger
              </h1>
            </Link>
            <Link
              href="/dashboard/achievements"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← Back to Achievements
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/dashboard/achievements"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Achievements
            </Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100">Edit</span>
          </div>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {achievementData.category && (
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                {achievementData.category}
              </span>
            )}
            {achievementData.is_structured && (
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                STAR Format
              </span>
            )}
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{format(new Date(achievementData.date), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Achievement Details
            </h1>
            <LikeButton
              achievementId={id}
              initialLikeCount={likeCount}
              initialHasLiked={hasLiked}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 mb-6">
          <AchievementForm
            action={updateAchievementActionWithId.bind(null, id)}
            submitText="Save Changes"
            cancelHref="/dashboard/achievements"
          >
            <div>
              <label
                htmlFor="rawText"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Achievement Description *
              </label>
              <textarea
                id="rawText"
                name="rawText"
                required
                rows={4}
                defaultValue={achievementData.raw_text}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {achievementData.is_structured && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  STAR Format
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="starSituation"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Situation
                    </label>
                    <textarea
                      id="starSituation"
                      name="starSituation"
                      rows={3}
                      defaultValue={achievementData.star_situation || ''}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="starTask"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Task
                    </label>
                    <textarea
                      id="starTask"
                      name="starTask"
                      rows={3}
                      defaultValue={achievementData.star_task || ''}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="starAction"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Action
                    </label>
                    <textarea
                      id="starAction"
                      name="starAction"
                      rows={3}
                      defaultValue={achievementData.star_action || ''}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="starResult"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Result
                    </label>
                    <textarea
                      id="starResult"
                      name="starResult"
                      rows={3}
                      defaultValue={achievementData.star_result || ''}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={achievementData.date}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  defaultValue={achievementData.category || ''}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={achievementData.tags?.join(', ') || ''}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Comma-separated tags"
              />
            </div>

          </AchievementForm>
          
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <DeleteButton achievementId={id} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
          <CommentsSection
            achievementId={id}
            comments={commentsList}
            currentUserId={user.id}
          />
        </div>
      </main>
    </div>
    )
  } catch (err) {
    console.error('Error loading achievement:', err)
    redirect('/dashboard/achievements')
  }
}

