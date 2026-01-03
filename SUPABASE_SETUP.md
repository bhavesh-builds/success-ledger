# Supabase Setup for Next.js

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Success Ledger project
3. Go to **Project Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 2: Create Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important:** Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 3: Verify Setup

After setting up your environment variables, restart your development server:

```bash
npm run dev
```

The app should start without errors. If you see environment variable errors, double-check your `.env.local` file.

## Project Structure

```
lib/supabase/
├── client.ts       # Browser client for client components
├── server.ts       # Server client for server components/actions
├── middleware.ts   # Middleware helper for session refresh
├── auth.ts         # Authentication utility functions
├── database.ts     # Database operation helpers
└── types.ts        # TypeScript type definitions
```

## Usage Examples

### In Client Components

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()
  
  // Use supabase client here
}
```

### In Server Components

```typescript
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth'

export default async function ServerComponent() {
  const user = await getUser()
  const supabase = await createClient()
  
  // Use supabase client here
}
```

### Authentication

```typescript
import { getUser, requireAuth, getUserProfile } from '@/lib/supabase/auth'

// Get current user (returns null if not authenticated)
const user = await getUser()

// Require authentication (redirects if not authenticated)
const user = await requireAuth()

// Get user profile
const profile = await getUserProfile(user.id)
```

### Database Operations

```typescript
import { 
  getAchievements, 
  createAchievement, 
  updateAchievement 
} from '@/lib/supabase/database'

// Get all achievements for a user
const { data, error } = await getAchievements(userId)

// Create a new achievement
const { data, error } = await createAchievement({
  user_id: userId,
  raw_text: 'My achievement...',
  date: '2024-01-15'
})

// Update an achievement
const { data, error } = await updateAchievement(
  achievementId,
  userId,
  { star_situation: 'Updated situation...' }
)
```

## Next Steps

1. ✅ Supabase client is configured
2. ✅ Database utilities are ready
3. ✅ Authentication helpers are set up
4. ⏭️ Create authentication pages (login/signup)
5. ⏭️ Build achievement capture features
6. ⏭️ Implement AI STAR structuring


