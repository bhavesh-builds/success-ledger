# Supabase Database Setup

This directory contains SQL migrations for the Success Ledger database schema.

## Setup Instructions

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Verify Tables**
   - Go to Table Editor in Supabase
   - You should see three tables:
     - `profiles` - stores user profile information
     - `achievements` - stores user achievements
     - `shares` - stores public share links

## Database Schema

### `profiles` Table
- `id` (UUID) - Primary key, references auth.users(id)
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - URL to user's avatar image
- `bio` (TEXT) - User biography/description
- `job_title` (TEXT) - User's job title
- `company` (TEXT) - User's company
- `location` (TEXT) - User's location
- `website` (TEXT) - User's website URL
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Note:** A profile is automatically created when a user signs up via the `handle_new_user()` trigger function.

### `achievements` Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `raw_text` (TEXT) - Original achievement text
- `star_situation` (TEXT) - STAR format: Situation
- `star_task` (TEXT) - STAR format: Task
- `star_action` (TEXT) - STAR format: Action
- `star_result` (TEXT) - STAR format: Result
- `date` (DATE) - Achievement date
- `category` (TEXT) - Optional category
- `tags` (TEXT[]) - Array of tags
- `is_structured` (BOOLEAN) - Whether STAR format is complete
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### `shares` Table
- `id` (UUID) - Primary key
- `achievement_id` (UUID) - Foreign key to achievements
- `share_token` (TEXT) - Unique token for public access
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `expires_at` (TIMESTAMPTZ) - Optional expiration

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles
- Users can view their own profile
- Users can view other users' profiles (for public sharing features)
- Users can only insert, update their own profile

### Achievements
- Users can only view, insert, update, and delete their own achievements

### Shares
- Anyone can view shares (for public access via token)
- Only achievement owners can create/delete shares

## Next Steps

After running the migration:
1. Set up environment variables in your Next.js app
2. Install Supabase client libraries
3. Configure authentication
4. Start building the application features

