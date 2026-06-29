import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check 1: Environment Variables
    results.checks.envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'MISSING'
    };

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      results.error = 'ENVIRONMENT VARIABLES MISSING ON RENDER';
      results.solution = 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Render Environment settings';
      return NextResponse.json(results, { status: 500 });
    }

    // Check 2: Create Supabase Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    results.checks.supabaseClient = 'Created successfully';

    // Check 3: Test appointments table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (tableError) {
      results.checks.appointmentsTable = {
        status: 'ERROR',
        error: tableError.message,
        code: tableError.code
      };

      if (tableError.code === '42P01') {
        results.error = 'APPOINTMENTS TABLE DOES NOT EXIST';
        results.solution = 'Run the SQL script FIX_SUPABASE_RLS.sql in Supabase SQL Editor';
      } else if (tableError.code === '42501') {
        results.error = 'ROW LEVEL SECURITY IS BLOCKING INSERTS';
        results.solution = 'Run: ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;';
      } else {
        results.error = tableError.message;
      }

      return NextResponse.json(results, { status: 500 });
    }

    results.checks.appointmentsTable = {
      status: 'EXISTS',
      rowCount: tableCheck?.length || 0
    };

    // Check 4: Test INSERT permission
    const testAppointment = {
      service: 'Emergency Test',
      stylist: 'System Test',
      appointment_date: new Date().toISOString(),
      appointment_time: '12:00 PM',
      customer_name: 'Test User',
      customer_email: 'test@test.com',
      customer_phone: '+1234567890',
      notes: 'Automated test from emergency-fix endpoint',
      status: 'pending'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('appointments')
      .insert([testAppointment])
      .select()
      .single();

    if (insertError) {
      results.checks.insertPermission = {
        status: 'FAILED',
        error: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      };

      if (insertError.code === '42501') {
        results.error = 'ROW LEVEL SECURITY IS BLOCKING INSERTS';
        results.solution = 'Run in Supabase SQL Editor: ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;';
      } else {
        results.error = insertError.message;
        results.solution = insertError.hint || 'Check Supabase error logs';
      }

      return NextResponse.json(results, { status: 500 });
    }

    results.checks.insertPermission = {
      status: 'SUCCESS',
      testAppointmentId: insertTest.id
    };

    // Check 5: Delete test appointment
    await supabase
      .from('appointments')
      .delete()
      .eq('id', insertTest.id);

    results.success = true;
    results.message = 'ALL CHECKS PASSED - BOOKING SHOULD WORK!';

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    results.error = 'UNEXPECTED ERROR';
    results.details = error.message;
    results.stack = error.stack;
    return NextResponse.json(results, { status: 500 });
  }
}
