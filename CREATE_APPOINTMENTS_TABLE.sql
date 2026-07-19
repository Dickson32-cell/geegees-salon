-- ============================================
-- CREATE APPOINTMENTS TABLE
-- ============================================
-- Run this in your Supabase SQL Editor if you haven't created the appointments table yet
-- ============================================

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
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
  revenue NUMERIC(10, 2) DEFAULT 0,
  final_price NUMERIC(10, 2),
  service_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_status
ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX IF NOT EXISTS idx_appointments_customer_email
ON appointments(LOWER(customer_email));

CREATE INDEX IF NOT EXISTS idx_appointments_created_at
ON appointments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to create appointments
CREATE POLICY "Allow anonymous appointment creation"
ON appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow authenticated users to view all appointments
CREATE POLICY "Allow authenticated users to view appointments"
ON appointments
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to update appointments
CREATE POLICY "Allow authenticated users to update appointments"
ON appointments
FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete appointments
CREATE POLICY "Allow authenticated users to delete appointments"
ON appointments
FOR DELETE
TO authenticated
USING (true);

-- Verify table created successfully
SELECT
  'Appointments table created successfully!' as status,
  COUNT(*) as existing_appointments
FROM appointments;
