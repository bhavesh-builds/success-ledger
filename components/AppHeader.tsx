import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface AppHeaderProps {
  user: { id: string; email?: string | null } | null
  userProfile: UserProfile | null
  showSignOut?: boolean
  variant?: 'landing' | 'dashboard'
}

export function AppHeader({ 
  user, 
  userProfile, 
  showSignOut = false,
  variant = 'landing'
}: AppHeaderProps) {
  const displayName = userProfile?.full_name || user?.email || 'User'
  const avatarUrl = userProfile?.avatar_url
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const navClasses = variant === 'dashboard'
    ? 'border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50'
    : 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'

  const titleClasses = variant === 'dashboard'
    ? 'text-xl font-bold text-zinc-900 dark:text-zinc-100'
    : 'text-xl font-bold'

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className={titleClasses}>Success Ledger</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {variant === 'dashboard' && (
                  <Link
                    href="/"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Home
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:inline-block">
                    {displayName}
                  </span>
                </Link>
                {variant === 'landing' && (
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                )}
                {showSignOut && (
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

