export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-10 w-96 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
        <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>

      <div className="mb-12">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
            >
              <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
              <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
            <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}


