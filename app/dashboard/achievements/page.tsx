import { requireAuth, getUserProfile } from '@/lib/supabase/auth'
import { getAchievements } from '@/lib/supabase/database'
import type { Database } from '@/lib/supabase/types'
import Link from 'next/link'
import { AchievementSearch } from '@/components/AchievementSearch'
import { AppHeader } from '@/components/AppHeader'

type Achievement = Database['public']['Tables']['achievements']['Row']

export default async function AchievementsPage() {
  const user = await requireAuth()
  const userProfile = await getUserProfile(user.id)
  const { data: achievements, error } = await getAchievements(user.id)
  
  // Type guard to ensure achievements is an array
  const achievementsList: Achievement[] = Array.isArray(achievements) ? achievements : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <AppHeader 
        user={user} 
        userProfile={userProfile} 
        variant="dashboard" 
        showSignOut={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/achievements/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            + Add Achievement
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            All Achievements
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {achievementsList.length} total achievements
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">
              Error loading achievements: {error.message}
            </p>
          </div>
        )}

        {!error && achievementsList.length === 0 ? (
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
        ) : (
          <AchievementSearch achievements={achievementsList} />
        )}
      </main>
    </div>
  )
}

