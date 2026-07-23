-- ============================================
-- FIX APPOINTMENTS SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Add missing columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS revenue NUMERIC,
ADD COLUMN IF NOT EXISTS final_price NUMERIC,
ADD COLUMN IF NOT EXISTS service_id INTEGER;

-- Success message
SELECT 'Appointments table schema updated successfully!' as status;
