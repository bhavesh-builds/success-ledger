import { AchievementDetailSkeleton } from '@/components/skeletons/AchievementDetailSkeleton'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Success Ledger
              </h1>
            </div>
            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 animate-pulse"></div>
        </div>

        <AchievementDetailSkeleton />
      </main>
    </div>
  )
}

