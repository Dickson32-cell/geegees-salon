import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('[TEST] Testing Supabase connection...');
    console.log('[TEST] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[TEST] SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test 1: Check services table
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(1);

    // Test 2: Check appointments table
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .limit(1);

    // Test 3: Try to insert a test appointment (but rollback)
    const testData = {
      service: 'Test Service',
      stylist: 'Test Stylist',
      appointment_date: new Date().toISOString(),
      appointment_time: '10:00 AM',
      customer_name: 'Test Customer',
      customer_email: 'test@test.com',
      customer_phone: '+1234567890',
      notes: 'Test booking',
      status: 'pending'
    };

    const { error: insertError } = await supabase
      .from('appointments')
      .insert([testData])
      .select()
      .single();

    return NextResponse.json({
      success: true,
      tests: {
        servicesTable: {
          exists: !servicesError,
          error: servicesError?.message,
          count: services?.length || 0
        },
        appointmentsTable: {
          exists: !appointmentsError,
          error: appointmentsError?.message,
          count: appointments?.length || 0
        },
        insertTest: {
          canInsert: !insertError,
          error: insertError?.message,
          errorCode: insertError?.code
        }
      },
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
