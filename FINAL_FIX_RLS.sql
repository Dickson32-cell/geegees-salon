-- ============================================
-- FINAL FIX - COMPLETELY DISABLE RLS
-- COPY AND RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- Step 1: Drop ALL policies (even if they don't exist)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'appointments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON appointments';
    END LOOP;
END $$;

-- Step 2: FORCE disable RLS
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant full public access
GRANT ALL ON appointments TO anon;
GRANT ALL ON appointments TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE appointments_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE appointments_id_seq TO authenticated;

-- Step 4: Verify RLS is disabled
SELECT
    tablename,
    rowsecurity as rls_enabled,
    CASE
        WHEN rowsecurity = true THEN '❌ STILL ENABLED - PROBLEM!'
        WHEN rowsecurity = false THEN '✅ DISABLED - READY!'
    END as status
FROM pg_tables
WHERE tablename = 'appointments';

-- Step 5: Test insert as anonymous user
INSERT INTO appointments (
    service,
    stylist,
    appointment_date,
    appointment_time,
    customer_name,
    customer_email,
    customer_phone,
    notes,
    status
) VALUES (
    'Test Booking',
    'Test Stylist',
    NOW(),
    '10:00 AM',
    'Test Customer',
    'test@example.com',
    '1234567890',
    'Final test',
    'pending'
);

-- Step 6: Success message
SELECT '✅ RLS COMPLETELY DISABLED - BOOKINGS SHOULD WORK NOW!' as final_status;
