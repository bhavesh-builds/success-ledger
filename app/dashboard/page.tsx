import { requireAuth } from '@/lib/supabase/auth'
import { signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { FeaturedAchievements } from '@/components/FeaturedAchievements'

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Success Ledger
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

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
          <FeaturedAchievements userId={user.id} limit={6} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Your Achievements
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              View and manage all your accomplishments
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Achievements
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Add Achievement
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Capture a new accomplishment
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add New
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Insights
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              View your growth and insights
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View Insights
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

