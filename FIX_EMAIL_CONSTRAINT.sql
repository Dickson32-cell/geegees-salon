-- ============================================
-- FIX customer_email NULL CONSTRAINT
-- RUN THIS NOW IN SUPABASE
-- ============================================

-- Allow NULL for customer_email column
ALTER TABLE appointments
ALTER COLUMN customer_email DROP NOT NULL;

-- Set default to empty string
ALTER TABLE appointments
ALTER COLUMN customer_email SET DEFAULT '';

-- Update any existing NULL values to empty string
UPDATE appointments
SET customer_email = ''
WHERE customer_email IS NULL;

-- Test insert without email
INSERT INTO appointments (
  service,
  stylist,
  appointment_date,
  appointment_time,
  customer_name,
  customer_phone
)
VALUES (
  'Test Service',
  'Test Stylist',
  NOW(),
  '10:00 AM',
  'Test Customer',
  '1234567890'
);

-- Verify it worked
SELECT 'SUCCESS! Email constraint fixed!' as status;
SELECT * FROM appointments ORDER BY id DESC LIMIT 1;
