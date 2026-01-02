import { getAchievements } from '@/lib/supabase/database'
import type { Database } from '@/lib/supabase/types'
import Link from 'next/link'
import { format } from 'date-fns'

type Achievement = Database['public']['Tables']['achievements']['Row']

interface FeaturedAchievementsProps {
  userId: string
  limit?: number
}

export async function FeaturedAchievements({ userId, limit = 6 }: FeaturedAchievementsProps) {
  const { data: achievements, error } = await getAchievements(userId)
  
  // Type guard to ensure achievements is an array
  const achievementsList: Achievement[] = Array.isArray(achievements) ? achievements : []

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading achievements. Please try again later.
        </p>
      </div>
    )
  }

  const featuredAchievements = achievementsList.slice(0, limit)

  if (featuredAchievements.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-400 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No achievements yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Start building your success ledger by capturing your first achievement.
          </p>
          <Link
            href="/dashboard/achievements/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Your First Achievement
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {achievementsList.length > limit && (
        <div className="flex justify-end mb-6">
          <Link
            href="/dashboard/achievements"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All ({achievementsList.length})
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}

function AchievementCard({
  achievement,
}: {
  achievement: Achievement
}) {
  const displayText = achievement.is_structured && achievement.star_result
    ? achievement.star_result
    : achievement.raw_text

  const truncatedText =
    displayText.length > 150 ? `${displayText.substring(0, 150)}...` : displayText

  return (
    <Link
      href={`/dashboard/achievements/${achievement.id}`}
      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {achievement.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded mb-2">
              {achievement.category}
            </span>
          )}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{format(new Date(achievement.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
        {achievement.is_structured && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              STAR
            </span>
          </div>
        )}
      </div>

      <p className="text-zinc-900 dark:text-zinc-100 mb-4">
        {truncatedText}
      </p>

      {achievement.tags && achievement.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {achievement.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
            >
              #{tag}
            </span>
          ))}
          {achievement.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400">
              +{achievement.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
        <span className="font-medium">View details</span>
        <svg
          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

