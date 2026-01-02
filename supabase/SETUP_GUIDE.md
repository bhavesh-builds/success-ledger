# Supabase Setup Guide for Success Ledger

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Select your Success Ledger project
3. In the left sidebar, click on **"SQL Editor"**
4. Click **"New query"** to create a new SQL query

### 2. Run the Migration

1. Open the file `supabase/migrations/001_initial_schema.sql` in your project
2. Copy the **entire contents** of the file (you can use `cat` command or open it in your editor)
3. Paste the SQL into the Supabase SQL Editor
4. Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)

### 3. Verify the Setup

After running the migration, verify everything was created:

#### Check Tables
1. Go to **"Table Editor"** in the left sidebar
2. You should see three tables:
   - ✅ `profiles`
   - ✅ `achievements`
   - ✅ `shares`

#### Check RLS Policies
1. Go to **"Authentication"** → **"Policies"** in the left sidebar
2. Or go to **"Table Editor"** → Select a table → Click **"Policies"** tab
3. Verify RLS policies are created for each table

#### Check Functions
1. Go to **"Database"** → **"Functions"** in the left sidebar
2. You should see:
   - ✅ `update_updated_at_column()`
   - ✅ `generate_share_token()`
   - ✅ `handle_new_user()`

#### Check Triggers
1. Go to **"Database"** → **"Triggers"** in the left sidebar
2. You should see:
   - ✅ `update_profiles_updated_at`
   - ✅ `update_achievements_updated_at`
   - ✅ `on_auth_user_created`

### 4. Get Your Supabase Credentials

You'll need these for your Next.js app:

1. Go to **"Project Settings"** (gear icon in left sidebar)
2. Click on **"API"** section
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (keep this secret! Only for server-side use)

### 5. Create Environment Variables File

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit `.env.local` to git (it's already in `.gitignore`)

## Troubleshooting

### Error: "relation already exists"
- This means some tables already exist. You can either:
  - Drop existing tables manually, or
  - The `IF NOT EXISTS` clauses should prevent errors, but if you see this, the migration partially ran

### Error: "permission denied"
- Make sure you're running the SQL as the project owner
- Some functions need `SECURITY DEFINER` which is already set in the migration

### Profile not created on signup
- Check that the `on_auth_user_created` trigger exists
- Verify the `handle_new_user()` function was created
- Check Supabase logs for any errors

## Next Steps

After successful setup:
1. ✅ Database schema is ready
2. ✅ RLS policies are configured
3. ✅ Triggers are set up
4. ⏭️ Install Supabase client in Next.js
5. ⏭️ Set up authentication pages
6. ⏭️ Build achievement features

## Quick Test

After setup, you can test by creating a test user:

1. Go to **"Authentication"** → **"Users"**
2. Click **"Add user"** → **"Create new user"**
3. Enter an email and password
4. Check the `profiles` table - a profile should be automatically created!

