import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: [],
    errors: [],
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?
        process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET'
    }
  };

  // Test 1: Check if we can connect to Supabase
  try {
    results.checks.push('✓ Supabase client created');
  } catch (error) {
    results.errors.push('✗ Failed to create Supabase client');
    results.checks.push(`✗ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  // Test 2: Try to query team_members table
  try {
    const { data, error, count } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: false });

    if (error) {
      results.errors.push({
        test: 'Query team_members table',
        error: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
      results.checks.push(`✗ Failed to query team_members table: ${error.message}`);
    } else {
      results.checks.push(`✓ Successfully queried team_members table`);
      results.checks.push(`✓ Found ${count || 0} team members in database`);
      results.teamMembers = data;
      results.teamMembersCount = count;
    }
  } catch (error) {
    results.errors.push({
      test: 'Query team_members table',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    results.checks.push(`✗ Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  // Test 3: Try to insert a test record (then delete it)
  try {
    const testMember = {
      name: 'TEST_MEMBER_DELETE_ME',
      title: 'Test',
      bio: 'This is a test member',
      specialties: ['Testing'],
      active: false,
      display_order: 9999
    };

    const { data: inserted, error: insertError } = await supabase
      .from('team_members')
      .insert([testMember])
      .select()
      .single();

    if (insertError) {
      results.errors.push({
        test: 'Insert test record',
        error: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        details: insertError.details
      });
      results.checks.push(`✗ Failed to insert test record: ${insertError.message}`);
    } else {
      results.checks.push(`✓ Successfully inserted test record (id: ${inserted.id})`);

      // Try to delete the test record
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('id', inserted.id);

      if (deleteError) {
        results.checks.push(`⚠ Warning: Could not delete test record (id: ${inserted.id})`);
      } else {
        results.checks.push(`✓ Successfully deleted test record`);
      }
    }
  } catch (error) {
    results.errors.push({
      test: 'Insert/Delete test record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    results.checks.push(`✗ Unexpected error during insert/delete: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  // Summary
  results.summary = {
    totalChecks: results.checks.length,
    totalErrors: results.errors.length,
    status: results.errors.length === 0 ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'
  };

  return NextResponse.json(results, {
    status: results.errors.length === 0 ? 200 : 500
  });
}
