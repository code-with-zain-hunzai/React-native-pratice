-- Migration: Add user information columns to user_presence table
-- Run this if you already created the user_presence table

-- Add new columns to store user information
ALTER TABLE user_presence 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- That's it! The existing data will remain, and new columns will be populated
-- when users go online next time.

-- Optional: If you want to see the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_presence'
ORDER BY ordinal_position;

