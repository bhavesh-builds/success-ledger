import { requireAuth, getUserProfile } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'
import { FeaturedAchievements } from '@/components/FeaturedAchievements'
import { AchievementListSkeleton } from '@/components/skeletons/AchievementListSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user) {
    redirect('/auth/login')
  }

  const userProfile = await getUserProfile(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <AppHeader 
        user={user} 
        userProfile={userProfile} 
        variant="dashboard" 
        showSignOut={true}
      />

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Start capturing your achievements and building your success ledger.
          </p>
        </div>

        {/* Featured Achievements Section */}
        <div className="mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Featured Achievements
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your recent accomplishments
            </p>
          </div>
          <Suspense fallback={<AchievementListSkeleton count={6} />}>
            <FeaturedAchievements userId={user.id} limit={6} />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/dashboard/achievements"
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Your Achievements
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              View and manage all your accomplishments
            </p>
            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
              View Achievements
            </div>
          </Link>

          <Link
            href="/dashboard/achievements/new"
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Add Achievement
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Capture a new accomplishment
            </p>
            <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block">
              Add New
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Profile Settings
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Manage your profile information
            </p>
            <div className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block">
              Edit Profile
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

