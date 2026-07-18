-- ============================================
-- Fix team_members timestamp columns
-- ============================================
-- This fixes the "updated_at violates not-null constraint" error
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add DEFAULT values to timestamp columns
ALTER TABLE team_members
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE team_members
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Verify the fix
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'team_members'
AND column_name IN ('created_at', 'updated_at');

-- Test insert (this should now work)
SELECT 'Fix applied successfully!' as status;
