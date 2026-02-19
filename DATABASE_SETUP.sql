-- Smart Bookmark App - Database Setup SQL
-- Copy and paste this into Supabase SQL Editor and run

-- Create the bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT user_bookmarks_unique UNIQUE (user_id, url)
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy 2: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy 3: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at);

-- Optional: Create a view for easier queries (not required, but useful)
CREATE VIEW user_bookmarks AS
SELECT 
  b.id,
  b.user_id,
  b.title,
  b.url,
  b.created_at,
  u.email as user_email
FROM bookmarks b
JOIN auth.users u ON b.user_id = u.id;

-- Notes:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. The UNIQUE constraint prevents duplicate URLs per user
-- 3. CASCADE delete removes bookmarks when user is deleted
-- 4. RLS policies are enforced at the database level
-- 5. Indexes improve query performance
-- 6. The view is optional but shows how to join with user data
