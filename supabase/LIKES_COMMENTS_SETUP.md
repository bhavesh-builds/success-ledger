# Likes and Comments Setup Guide

This guide explains how to set up the likes and comments social features in Supabase.

## Overview

The migration adds two new tables:
1. **comments** - For storing comments on achievements (supports nested/reply comments)
2. **likes** - For storing likes on achievements (one like per user per achievement)

## Running the Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/002_likes_comments.sql`
4. Paste and execute the SQL in the SQL Editor
5. Verify the tables were created successfully

## Database Schema

### Comments Table

```sql
comments
├── id (UUID, Primary Key)
├── achievement_id (UUID, Foreign Key → achievements.id)
├── user_id (UUID, Foreign Key → auth.users.id)
├── content (TEXT, Required)
├── parent_id (UUID, Foreign Key → comments.id, Optional - for replies)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

**Features:**
- Supports nested comments (replies) via `parent_id`
- Automatic timestamp management
- Cascade delete when achievement or user is deleted

### Likes Table

```sql
likes
├── id (UUID, Primary Key)
├── achievement_id (UUID, Foreign Key → achievements.id)
├── user_id (UUID, Foreign Key → auth.users.id)
├── created_at (TIMESTAMPTZ)
└── UNIQUE(achievement_id, user_id) -- One like per user per achievement
```

**Features:**
- Unique constraint ensures one like per user per achievement
- Cascade delete when achievement or user is deleted
- Simple structure for fast queries

## Row Level Security (RLS) Policies

### Comments Policies

- **SELECT**: Anyone can view comments (public read)
- **INSERT**: Authenticated users can create comments
- **UPDATE**: Users can only update their own comments
- **DELETE**: Users can only delete their own comments

### Likes Policies

- **SELECT**: Anyone can view likes (public read)
- **INSERT**: Authenticated users can create likes
- **DELETE**: Users can only delete their own likes (unlike)

## Helper Functions

The migration includes three helper functions:

1. **`get_achievement_comment_count(achievement_uuid UUID)`**
   - Returns the total number of comments on an achievement

2. **`get_achievement_like_count(achievement_uuid UUID)`**
   - Returns the total number of likes on an achievement

3. **`has_user_liked(achievement_uuid UUID, user_uuid UUID)`**
   - Returns `true` if the user has liked the achievement, `false` otherwise

## Indexes

The migration creates indexes for optimal query performance:

- `idx_comments_achievement_id` - Fast lookup of comments by achievement
- `idx_comments_user_id` - Fast lookup of comments by user
- `idx_comments_parent_id` - Fast lookup of reply comments
- `idx_comments_created_at` - Sorted comments by date
- `idx_likes_achievement_id` - Fast lookup of likes by achievement
- `idx_likes_user_id` - Fast lookup of likes by user
- `idx_likes_achievement_user` - Fast check if user liked an achievement

## Important Notes

### Achievement Visibility

**Current RLS Policy**: Achievements are only viewable by their owners.

**For Social Features**: You may need to adjust the achievements RLS policy to allow:
- Public viewing of achievements (if you want public likes/comments)
- Or viewing of achievements that have been shared via share tokens

**Option 1 - Make achievements public:**
```sql
-- Allow public viewing of achievements
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);
```

**Option 2 - Allow viewing shared achievements:**
```sql
-- Allow viewing achievements that have shares
CREATE POLICY "Shared achievements are viewable"
  ON achievements FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM shares
      WHERE shares.achievement_id = achievements.id
    )
  );
```

**Option 3 - Keep current policy (private achievements):**
- Only achievement owners can see their achievements
- Likes/comments will only be visible to the achievement owner
- This might be suitable for a private journaling app

### Testing the Migration

After running the migration, you can test it:

```sql
-- Test comment creation
INSERT INTO comments (achievement_id, user_id, content)
VALUES ('your-achievement-id', 'your-user-id', 'Great achievement!');

-- Test like creation
INSERT INTO likes (achievement_id, user_id)
VALUES ('your-achievement-id', 'your-user-id');

-- Test helper functions
SELECT get_achievement_comment_count('your-achievement-id');
SELECT get_achievement_like_count('your-achievement-id');
SELECT has_user_liked('your-achievement-id', 'your-user-id');
```

## Next Steps

After running this migration:

1. Update TypeScript types in `lib/supabase/types.ts`
2. Create database functions in `lib/supabase/database.ts`
3. Create server actions in `app/actions/`
4. Build UI components for likes and comments
5. Integrate into achievement detail pages

## Troubleshooting

### Error: "relation already exists"
- The tables might already exist. Use `DROP TABLE IF EXISTS` if you need to recreate them.

### Error: "permission denied"
- Make sure you're running the SQL as a database administrator or with proper permissions.

### RLS Policy Issues
- If you can't see comments/likes, check that RLS policies are correctly set up.
- Test with authenticated users to ensure policies work as expected.


