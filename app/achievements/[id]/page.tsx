import { getAchievementById, getComments, getLikeCount, hasUserLiked } from '@/lib/supabase/database'
import type { Database } from '@/lib/supabase/types'
import Link from 'next/link'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'
import { getUser } from '@/lib/supabase/auth'

type Achievement = Database['public']['Tables']['achievements']['Row']

export default async function PublicAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const user = await getUser()
    const { id } = await params
    
    if (!id) {
      redirect('/')
    }
    
    // Get achievement without user filter (public view)
    const supabase = await (await import('@/lib/supabase/server')).createClient()
    const { data: achievement, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !achievement) {
      redirect('/')
    }

    const achievementData = achievement as Achievement

    // Fetch likes and comments (only if user is logged in)
    let likeCount = 0
    let hasLiked = false
    let commentsList: any[] = []

    if (user) {
      const likeResult = await getLikeCount(id)
      likeCount = likeResult.count
      const likedResult = await hasUserLiked(id, user.id)
      hasLiked = likedResult.hasLiked
      const { data: comments } = await getComments(id)
      commentsList = Array.isArray(comments) ? comments : []
    } else {
      // For non-logged in users, still show counts
      const likeResult = await getLikeCount(id)
      likeCount = likeResult.count
      const { data: comments } = await getComments(id)
      commentsList = Array.isArray(comments) ? comments : []
    }

    // Fetch author profile
    const { data: authorProfileData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', achievementData.user_id)
      .single()
    
    const authorProfile = authorProfileData as { id: string; full_name: string | null; avatar_url: string | null } | null

    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Success Ledger
                </h1>
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/"
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Home
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Home
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">Achievement</span>
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
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Achievement Details
                </h1>
                {authorProfile && (
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {authorProfile?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span>By {authorProfile?.full_name || 'Anonymous'}</span>
                  </div>
                )}
              </div>
              {user && (
                <LikeButton
                  achievementId={id}
                  initialLikeCount={likeCount}
                  initialHasLiked={hasLiked}
                />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Description
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {achievementData.raw_text}
              </p>
            </div>

            {achievementData.is_structured && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  STAR Format
                </h3>
                <div className="space-y-4">
                  {achievementData.star_situation && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Situation
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {achievementData.star_situation}
                      </p>
                    </div>
                  )}
                  {achievementData.star_task && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Task
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {achievementData.star_task}
                      </p>
                    </div>
                  )}
                  {achievementData.star_action && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Action
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {achievementData.star_action}
                      </p>
                    </div>
                  )}
                  {achievementData.star_result && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Result
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {achievementData.star_result}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {achievementData.tags && achievementData.tags.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-6">
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {achievementData.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section - Only show if user is logged in */}
          {user && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
              <CommentsSection
                achievementId={id}
                comments={commentsList}
                currentUserId={user.id}
              />
            </div>
          )}

          {!user && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Sign in to like and comment on this achievement
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  } catch (err) {
    console.error('Error loading achievement:', err)
    redirect('/')
  }
}

