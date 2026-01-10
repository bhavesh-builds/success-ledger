# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Success Ledger is an AI-powered personal achievement platform built with Next.js 16, React, TypeScript, and Supabase. It enables users to journal accomplishments, structure them in STAR format, and share achievements publicly with social features (likes, comments).

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# TypeScript
npx tsc --noEmit        # Type check without emitting files
```

## Environment Setup

Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Supabase migrations are located in `supabase/migrations/` and must be run in order:
1. `001_initial_schema.sql` - Core tables (profiles, achievements, shares)
2. `002_likes_comments.sql` - Social features (comments, likes)
3. `003_public_achievements.sql` - Makes achievements publicly viewable

Run migrations via Supabase Dashboard → SQL Editor.

## Architecture Overview

### Authentication & Authorization

- **Middleware-based auth**: `middleware.ts` uses `@supabase/ssr` to refresh auth tokens on every request
- **Auth utilities**: `lib/supabase/auth.ts` provides `getUser()`, `requireAuth()`, and `getUserProfile()`
- **Client types**: Three distinct Supabase client patterns:
  - `lib/supabase/client.ts`: Browser client for Client Components
  - `lib/supabase/server.ts`: Server client for Server Components/Actions
  - `lib/supabase/middleware.ts`: Middleware-specific client for auth refresh

### Data Layer

- **Database operations**: Centralized in `lib/supabase/database.ts`
- **Type safety**: Database types in `lib/supabase/types.ts` generated from Supabase schema
- **Server Actions**: All mutations go through `app/actions/` directory:
  - `achievements.ts`: Achievement CRUD operations
  - `profile.ts`: Profile updates
  - `comments.ts`: Comment operations
- **RLS (Row Level Security)**: Database enforces access control:
  - Achievements: Public read, owner-only write/delete
  - Profiles: Public read, owner-only write
  - Comments/Likes: Public read, authenticated write, owner-only delete

### Route Structure

```
app/
├── page.tsx                        # Landing page (public)
├── auth/
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── callback/route.ts           # OAuth callback handler
├── dashboard/                      # Protected routes
│   ├── page.tsx                    # Dashboard home
│   ├── achievements/
│   │   ├── page.tsx                # Achievement list
│   │   ├── new/page.tsx            # Create achievement
│   │   └── [id]/page.tsx           # Edit achievement (private)
│   └── profile/page.tsx            # User profile settings
├── achievements/
│   └── [id]/page.tsx               # Public achievement view (with comments/likes)
└── actions/                        # Server Actions
```

### Component Organization

- **UI primitives**: `components/ui/` - shadcn/ui components (button, card, input, etc.)
- **Landing components**: `components/landing/` - Marketing/homepage sections
- **Skeletons**: `components/skeletons/` - Loading states for different pages
- **Feature components**: Root `components/` directory for domain components

### Data Flow Patterns

1. **Server-side rendering (SSR)**:
   - Pages fetch data using `lib/supabase/server.ts` client
   - Data passed as props to Client Components
   - Example: `app/dashboard/achievements/page.tsx` fetches achievements, passes to display components

2. **Mutations**:
   - Forms submit to Server Actions in `app/actions/`
   - Server Actions validate auth with `requireAuth()`
   - Database operations via `lib/supabase/database.ts`
   - Revalidate paths with `revalidatePath()` and redirect

3. **Client-side interactions**:
   - Client Components import `lib/supabase/client.ts` for real-time or optimistic updates
   - Example: Comment/like interactions in `components/CommentsSection.tsx`

## Key Technical Details

### Next.js 16 Compatibility
- Uses middleware pattern (not deprecated `_middleware.ts`)
- Server Components by default, Client Components marked with `'use client'`
- Server Actions marked with `'use server'`

### Supabase Integration
- **@supabase/ssr** package for SSR-compatible auth
- Database functions defined in migrations (e.g., `generate_share_token()`, `handle_new_user()`)
- Profile auto-creation via database trigger on user signup

### Path Aliases
- `@/*` resolves to project root (configured in `tsconfig.json`)
- Example: `import { createClient } from '@/lib/supabase/server'`

### Styling
- Tailwind CSS 4 with PostCSS
- Global styles in `app/globals.css`
- Component variants via `class-variance-authority`

## Database Schema Notes

**achievements** table:
- `raw_text`: Original achievement description
- `star_*` fields: Structured STAR format (Situation, Task, Action, Result)
- `is_structured`: Boolean flag if STAR fields are populated
- `tags`: Array of strings for categorization

**profiles** table:
- Auto-created via trigger when user signs up
- Initially populated with user's email or full_name from auth metadata

**comments** table:
- Supports nested comments via `parent_id` self-reference
- Joined with profiles in queries for user display info

**likes** table:
- Unique constraint on (achievement_id, user_id) prevents duplicate likes

## Common Patterns

### Fetching data with profiles
Many queries join profiles separately to avoid RLS issues:
```typescript
// Fetch main data
const { data: achievements } = await supabase.from('achievements').select('*')

// Fetch related profiles
const userIds = [...new Set(achievements.map(a => a.user_id))]
const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds)

// Map profiles to achievements
const profilesMap = new Map(profiles.map(p => [p.id, p]))
const result = achievements.map(a => ({ ...a, profiles: profilesMap.get(a.user_id) }))
```

### Type assertion workarounds
Due to Supabase type generation quirks, you'll see `@ts-expect-error` comments on insert/update operations. This is expected and documented in the codebase.

### Loading states
Each page has a corresponding `loading.tsx` that renders skeleton components from `components/skeletons/`.
