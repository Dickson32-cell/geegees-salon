-- =============================================
-- ADD IMAGE_URL COLUMN TO SERVICES TABLE
-- =============================================
-- Run this SQL in Supabase SQL Editor to add
-- the image_url column to your services table
-- =============================================

-- Add image_url column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'services';
