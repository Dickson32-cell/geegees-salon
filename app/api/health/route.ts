import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    checks: {}
  };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Test 1: Can we query the services table?
    diagnostics.checks.servicesTable = 'testing...';
    const { count, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    diagnostics.checks.servicesTable = `success (${count || 0} services)`;
    diagnostics.servicesCount = count || 0;

    // Test 2: Can we fetch a sample service?
    if (count && count > 0) {
      const { data: sample, error: sampleError } = await supabase
        .from('services')
        .select('*')
        .limit(1)
        .single();

      if (sampleError) {
        diagnostics.checks.sampleService = 'error: ' + sampleError.message;
      } else {
        diagnostics.checks.sampleService = sample ? 'success' : 'no data';
        diagnostics.sampleService = sample;
      }
    }

    // Test 3: Check team members table
    diagnostics.checks.teamTable = 'testing...';
    const { count: teamCount, error: teamError } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true });

    if (teamError) {
      diagnostics.checks.teamTable = 'error: ' + teamError.message;
    } else {
      diagnostics.checks.teamTable = `success (${teamCount || 0} members)`;
      diagnostics.teamCount = teamCount || 0;
    }

    // Test 4: Check gallery images table
    diagnostics.checks.galleryTable = 'testing...';
    const { count: galleryCount, error: galleryError } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true });

    if (galleryError) {
      diagnostics.checks.galleryTable = 'error: ' + galleryError.message;
    } else {
      diagnostics.checks.galleryTable = `success (${galleryCount || 0} images)`;
      diagnostics.galleryCount = galleryCount || 0;
    }

    diagnostics.status = 'healthy';
  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.error = {
      message: error.message,
      code: error.code,
      name: error.name,
      hint: error.hint,
      details: error.details
    };
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.status === 'healthy' ? 200 : 500
  });
}
