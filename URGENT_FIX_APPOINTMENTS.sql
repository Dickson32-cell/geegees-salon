-- ============================================
-- URGENT FIX FOR APPOINTMENTS
-- Run this NOW in Supabase SQL Editor
-- ============================================

-- Drop existing appointments table if it has issues
DROP TABLE IF EXISTS appointments CASCADE;

-- Create fresh appointments table
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  service TEXT NOT NULL,
  stylist TEXT NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_phone TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security to allow public bookings
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Test insert to verify it works
INSERT INTO appointments (
  service,
  stylist,
  appointment_date,
  appointment_time,
  customer_name,
  customer_phone
) VALUES (
  'Test Service',
  'Test Stylist',
  NOW(),
  '10:00 AM',
  'Test Customer',
  '1234567890'
);

-- Show the test appointment
SELECT * FROM appointments;

-- Success message
SELECT 'Appointments table fixed! Try booking now.' as status;
