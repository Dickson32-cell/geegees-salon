-- Add photo_url column to team_members table
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;

SELECT 'team_members table updated with photo_url column' as status;
