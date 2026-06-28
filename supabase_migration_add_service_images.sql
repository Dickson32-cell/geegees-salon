-- Migration: Add image_url column to services table
-- Run this in Supabase SQL Editor

ALTER TABLE services
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN services.image_url IS 'Optional image URL for service (Supabase Storage public URL)';

-- Verify the migration
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'services'
ORDER BY ordinal_position;
