export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse">
          <div className="mb-8 text-center">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto mb-2"></div>
            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}


