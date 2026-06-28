-- Migration: Fix website_content table unique constraint
-- Date: 2026-06-28
-- Description: Changes unique constraint from page only to page+section combination

-- Step 1: Drop the existing unique constraint on 'page' column
ALTER TABLE website_content
DROP CONSTRAINT IF EXISTS website_content_page_key;

-- Step 2: Add a new unique constraint on the combination of page and section
ALTER TABLE website_content
ADD CONSTRAINT website_content_page_section_key UNIQUE (page, section);

-- Add comment for documentation
COMMENT ON CONSTRAINT website_content_page_section_key ON website_content
IS 'Ensures each page-section combination is unique (e.g., home-hero, home-about)';
