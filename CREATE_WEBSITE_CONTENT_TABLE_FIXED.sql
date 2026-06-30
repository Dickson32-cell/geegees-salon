-- Create website_content table for Content Management System
-- Run this in Supabase SQL Editor

-- Step 1: Drop table if it exists (to start fresh)
DROP TABLE IF EXISTS website_content CASCADE;

-- Step 2: Create the website_content table
CREATE TABLE website_content (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page, section)
);

-- Step 3: Disable Row Level Security (IMPORTANT!)
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;

-- Step 4: Grant full access to anon and authenticated roles (just in case)
GRANT ALL ON website_content TO anon;
GRANT ALL ON website_content TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE website_content_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE website_content_id_seq TO authenticated;

-- Step 5: Create an index for faster lookups
CREATE INDEX idx_website_content_page_section ON website_content(page, section);

-- Step 6: Insert default home page about section
INSERT INTO website_content (page, section, content)
VALUES (
    'home',
    'about',
    '{"title": "Redefining Luxury Grooming", "description": "GeeGees Unisex Salon is more than a destination; it is a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.", "stat1Value": "15+", "stat1Label": "Years of Mastery", "stat2Value": "24k", "stat2Label": "Clients Styled", "buttonText": "Our Story", "buttonLink": "/team"}'::jsonb
)
ON CONFLICT (page, section) DO NOTHING;

-- Step 7: Verify everything is set up correctly
SELECT
    'Table exists' as check_name,
    COUNT(*) as count
FROM website_content;

SELECT
    'Permissions granted' as check_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'website_content';

-- Step 8: Final verification - show all content
SELECT page, section, content FROM website_content;
