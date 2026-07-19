import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  try {
    // Test 1: Check Supabase connection
    results.tests.push({
      test: 'Supabase Environment Variables',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    });

    // Test 2: Check if appointments table exists
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .limit(1);

      if (error) {
        results.tests.push({
          test: 'Appointments Table Access',
          status: '❌ Failed',
          error: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
        });
      } else {
        results.tests.push({
          test: 'Appointments Table Access',
          status: '✅ Success',
          message: 'Table exists and is accessible',
          recordCount: data?.length || 0,
        });
      }
    } catch (error: any) {
      results.tests.push({
        test: 'Appointments Table Access',
        status: '❌ Exception',
        error: error.message,
      });
    }

    // Test 3: Check table schema
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'appointments' })
        .limit(1);

      if (schemaError) {
        // Try alternative method to get schema info
        const { data: columns, error: colError } = await supabase
          .from('appointments')
          .select('*')
          .limit(0);

        results.tests.push({
          test: 'Table Schema Check',
          status: colError ? '⚠️ Limited Info' : '✅ Exists',
          note: 'Cannot retrieve detailed schema, but table exists',
        });
      } else {
        results.tests.push({
          test: 'Table Schema',
          status: '✅ Retrieved',
          schema: schemaData,
        });
      }
    } catch (error: any) {
      results.tests.push({
        test: 'Table Schema Check',
        status: '⚠️ Skipped',
        note: 'Schema introspection not available',
      });
    }

    // Test 4: Try to insert a test appointment
    try {
      const testAppointment = {
        service: 'TEST SERVICE - DELETE ME',
        stylist: 'TEST STYLIST',
        appointment_date: new Date().toISOString(),
        appointment_time: '10:00 AM',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '1234567890',
        notes: 'This is a test appointment - please delete',
        status: 'pending',
      };

      const { data: insertData, error: insertError } = await supabase
        .from('appointments')
        .insert([testAppointment])
        .select()
        .single();

      if (insertError) {
        results.tests.push({
          test: 'Test Appointment Insert',
          status: '❌ Failed',
          error: insertError.message,
          code: insertError.code,
          hint: insertError.hint,
          details: insertError.details,
          testData: testAppointment,
        });
      } else {
        results.tests.push({
          test: 'Test Appointment Insert',
          status: '✅ Success',
          message: 'Successfully created test appointment',
          appointmentId: insertData.id,
        });

        // Clean up: Delete the test appointment
        const { error: deleteError } = await supabase
          .from('appointments')
          .delete()
          .eq('id', insertData.id);

        if (!deleteError) {
          results.tests.push({
            test: 'Test Appointment Cleanup',
            status: '✅ Deleted',
            message: 'Test appointment cleaned up successfully',
          });
        }
      }
    } catch (error: any) {
      results.tests.push({
        test: 'Test Appointment Insert',
        status: '❌ Exception',
        error: error.message,
        stack: error.stack,
      });
    }

    // Summary
    const failedTests = results.tests.filter((t: any) =>
      t.status?.includes('❌') || t.status?.includes('Failed')
    );

    results.summary = {
      total: results.tests.length,
      passed: results.tests.length - failedTests.length,
      failed: failedTests.length,
      overallStatus: failedTests.length === 0 ? '✅ All Tests Passed' : '❌ Some Tests Failed',
    };

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test suite failed',
      message: error.message,
      stack: error.stack,
      results,
    }, { status: 500 });
  }
}
