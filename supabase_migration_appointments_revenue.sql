-- Migration: Add revenue tracking fields to appointments table
-- Date: 2026-06-28
-- Description: Adds service_id, final_price, revenue, and updated_at columns for revenue tracking

-- Add service_id column (optional foreign key reference)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS service_id INTEGER;

-- Add final_price column (actual price charged)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS final_price TEXT;

-- Add revenue column (calculated revenue for completed bookings)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS revenue DECIMAL(10, 2);

-- Add updated_at column (track when appointment was last modified)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add comments for documentation
COMMENT ON COLUMN appointments.service_id IS 'Optional foreign key to services table for better data integrity';
COMMENT ON COLUMN appointments.final_price IS 'Actual price charged (may differ from service price due to discounts, etc.)';
COMMENT ON COLUMN appointments.revenue IS 'Revenue amount when status is marked as completed';
COMMENT ON COLUMN appointments.updated_at IS 'Timestamp of last update to the appointment';

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_updated_at_trigger ON appointments;
CREATE TRIGGER appointments_updated_at_trigger
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointments_updated_at();

-- Add index on service_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);

-- Add index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Add index on appointment_date for date-based queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
