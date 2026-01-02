export function AchievementCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>
        <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-4 w-4/6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-6 w-14 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>
    </div>
  )
}

