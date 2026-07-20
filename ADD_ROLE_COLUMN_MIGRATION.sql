-- Migration: Add role column to team_members table
-- Date: 2026-07-19
-- Description: Adds a 'role' column to distinguish between stylists, receptionists, and managers

-- Add the role column with default value 'stylist'
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'stylist';

-- Update existing team members based on their title
-- This tries to intelligently set roles based on job titles
UPDATE team_members
SET role = CASE
  WHEN LOWER(title) LIKE '%reception%' THEN 'receptionist'
  WHEN LOWER(title) LIKE '%manager%' THEN 'manager'
  ELSE 'stylist'
END
WHERE role IS NULL OR role = 'stylist';

-- Add a comment to the column for documentation
COMMENT ON COLUMN team_members.role IS 'Job role: stylist, receptionist, or manager';
