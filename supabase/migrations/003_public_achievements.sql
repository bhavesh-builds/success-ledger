-- Success Ledger: Make achievements publicly viewable
-- Run this in your Supabase SQL Editor

-- Drop the existing private policy
DROP POLICY IF EXISTS "Users can view their own achievements" ON achievements;

-- Create a new policy that allows public viewing of achievements
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements
  FOR SELECT
  USING (true);

-- Note: Users can still only INSERT, UPDATE, and DELETE their own achievements
-- The existing policies for INSERT, UPDATE, and DELETE remain unchanged

