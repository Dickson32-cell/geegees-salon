-- ============================================
-- Create Team Members Table
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This will create the team_members table and set up permissions
-- ============================================

-- 1. Drop existing table if you want to start fresh (OPTIONAL - ONLY if you have issues)
-- DROP TABLE IF EXISTS team_members CASCADE;

-- 2. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

-- 4. Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS team_members_updated_at_trigger ON team_members;
CREATE TRIGGER team_members_updated_at_trigger
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_team_members_updated_at();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to team_members" ON team_members;
DROP POLICY IF EXISTS "Allow public insert access to team_members" ON team_members;
DROP POLICY IF EXISTS "Allow public update access to team_members" ON team_members;
DROP POLICY IF EXISTS "Allow public delete access to team_members" ON team_members;

-- 7. Create RLS policies to allow public access (since this is for a public website)
-- Allow anyone to read team members
CREATE POLICY "Allow public read access to team_members"
ON team_members
FOR SELECT
TO public
USING (true);

-- Allow anyone to insert team members (you can restrict this later)
CREATE POLICY "Allow public insert access to team_members"
ON team_members
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to update team members (you can restrict this later)
CREATE POLICY "Allow public update access to team_members"
ON team_members
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow anyone to delete team members (you can restrict this later)
CREATE POLICY "Allow public delete access to team_members"
ON team_members
FOR DELETE
TO public
USING (true);

-- 8. Insert sample team members (OPTIONAL - you can skip this)
-- Uncomment the lines below if you want sample data
/*
INSERT INTO team_members (name, title, bio, specialties, active, display_order)
VALUES
    ('Sarah Johnson', 'Master Hair Stylist', 'With over 12 years of experience, Sarah specializes in creative hair coloring and cutting-edge styles.', ARRAY['Hair Coloring', 'Creative Cuts', 'Balayage'], true, 1),
    ('Michael Chen', 'Senior Stylist', 'Michael is passionate about men''s grooming and creating timeless, sophisticated looks.', ARRAY['Men''s Grooming', 'Classic Cuts', 'Beard Styling'], true, 2),
    ('Elena Rodriguez', 'Spa Director', 'Elena brings 15 years of skincare expertise and creates personalized facial treatments.', ARRAY['Facial Treatments', 'Skincare', 'Anti-Aging'], true, 3)
ON CONFLICT DO NOTHING;
*/

-- 9. Verify the table was created
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'team_members'
ORDER BY ordinal_position;

-- 10. Check row count
SELECT COUNT(*) as total_team_members FROM team_members;

-- ============================================
-- DONE! Your team_members table is ready.
-- ============================================
-- Now you can add team members from the admin panel!
-- ============================================
