import { createClient } from '@/lib/supabase/server'

export default async function SupabaseTest() {
  let connectionStatus = 'checking'
  let connectionMessage = 'Testing connection...'
  let tableCheck = false
  let errorMessage: string | null = null

  try {
    // Test 1: Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      connectionStatus = 'error'
      connectionMessage = 'Environment variables not configured'
      errorMessage = 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    } else {
      // Test 2: Try to create a Supabase client
      const supabase = await createClient()
      
      // Test 3: Try a simple query to check connection
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      if (error) {
        // If it's a table doesn't exist error, that's actually okay - it means we're connected
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          connectionStatus = 'warning'
          connectionMessage = 'Connected to Supabase, but tables may not be created yet'
          errorMessage = 'Please run the migration script in Supabase SQL Editor'
        } else if (error.code === 'PGRST301' || error.message.includes('JWT')) {
          connectionStatus = 'error'
          connectionMessage = 'Authentication error - check your API keys'
          errorMessage = error.message
        } else {
          connectionStatus = 'error'
          connectionMessage = 'Database query failed'
          errorMessage = error.message
        }
      } else {
        connectionStatus = 'success'
        connectionMessage = 'Successfully connected to Supabase!'
        tableCheck = true
      }
    }
  } catch (error) {
    connectionStatus = 'error'
    connectionMessage = 'Connection failed'
    errorMessage = error instanceof Error ? error.message : 'Unknown error'
  }

  const statusColors = {
    success: 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    checking: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200',
  }

  return (
    <div className={`border-2 rounded-lg p-6 ${statusColors[connectionStatus as keyof typeof statusColors]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {connectionStatus === 'success' && (
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {connectionStatus === 'error' && (
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {connectionStatus === 'warning' && (
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {connectionStatus === 'checking' && (
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Supabase Connection Test</h3>
          <p className="mb-2">{connectionMessage}</p>
          {tableCheck && (
            <p className="text-sm opacity-80">✓ Database tables are accessible</p>
          )}
          {errorMessage && (
            <div className="mt-3 p-3 bg-black/10 dark:bg-white/10 rounded text-sm font-mono">
              <strong>Details:</strong> {errorMessage}
            </div>
          )}
          {connectionStatus === 'success' && (
            <div className="mt-3 text-sm">
              <p className="opacity-80">✓ Environment variables configured</p>
              <p className="opacity-80">✓ Supabase client initialized</p>
              <p className="opacity-80">✓ Database connection successful</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

