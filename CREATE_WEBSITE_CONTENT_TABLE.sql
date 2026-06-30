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

-- Step 3: Disable Row Level Security
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;

-- Step 4: Create an index for faster lookups
CREATE INDEX idx_website_content_page_section ON website_content(page, section);

-- Step 5: Insert default home page about section
INSERT INTO website_content (page, section, content)
VALUES (
    'home',
    'about',
    '{
        "title": "Redefining Luxury Grooming",
        "description": "GeeGees Unisex Salon is more than a destination; it''s a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.",
        "stat1Value": "15+",
        "stat1Label": "Years of Mastery",
        "stat2Value": "24k",
        "stat2Label": "Clients Styled",
        "buttonText": "Our Story",
        "buttonLink": "/team"
    }'::jsonb
)
ON CONFLICT (page, section) DO NOTHING;

-- Step 6: Verify the data was inserted
SELECT page, section, content FROM website_content;
