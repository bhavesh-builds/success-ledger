import { requireAuth } from '@/lib/supabase/auth'
import { createAchievementAction } from '@/app/actions/achievements'
import Link from 'next/link'
import { AchievementForm } from '@/components/AchievementForm'

export default async function NewAchievementPage() {
  await requireAuth()

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Add New Achievement
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Capture your accomplishment and we'll help structure it later.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
          <AchievementForm
            action={createAchievementAction}
            submitText="Save Achievement"
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
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Describe what you accomplished... e.g., 'Led a team of 5 developers to launch a new feature that increased user engagement by 30%'"
              />
            </div>

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
                  defaultValue={new Date().toISOString().split('T')[0]}
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
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Leadership, Technical, Project"
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
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Comma-separated tags (e.g., leadership, team, success)"
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Separate multiple tags with commas
              </p>
            </div>

          </AchievementForm>
        </div>
      </main>
    </div>
  )
}

