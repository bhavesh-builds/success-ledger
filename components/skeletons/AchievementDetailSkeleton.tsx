export function AchievementDetailSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
          <div>
            <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>

        <div>
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>

        <div className="flex gap-4 pt-4">
          <div className="h-12 flex-1 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-12 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

