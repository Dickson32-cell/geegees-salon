-- ============================================
-- GeeGees Salon - Complete Database Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This will create ALL required tables for the booking system
-- ============================================

-- 1. Create services table (if not exists)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create appointments table (if not exists)
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    service TEXT NOT NULL,
    stylist TEXT NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    appointment_time TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    service_id INTEGER,
    final_price TEXT,
    revenue DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create website_content table (if not exists)
CREATE TABLE IF NOT EXISTS website_content (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page, section)
);

-- 4. Create team_members table (if not exists)
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    specialties TEXT[],
    active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create gallery_images table (if not exists)
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_phone ON appointments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 7. Create trigger to auto-update updated_at timestamp for appointments
CREATE OR REPLACE FUNCTION update_updated_at_column()
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
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS services_updated_at_trigger ON services;
CREATE TRIGGER services_updated_at_trigger
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Grant necessary permissions (adjust if using RLS)
-- If you have Row Level Security enabled, you may need to add policies

-- 9. Verify tables were created
SELECT
    'services' as table_name,
    COUNT(*) as row_count
FROM services
UNION ALL
SELECT
    'appointments' as table_name,
    COUNT(*) as row_count
FROM appointments
UNION ALL
SELECT
    'website_content' as table_name,
    COUNT(*) as row_count
FROM website_content;

-- ============================================
-- DONE! Your database is now set up.
-- ============================================
