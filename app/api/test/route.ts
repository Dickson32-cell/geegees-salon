import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Missing',
    };

    // Try to connect to Supabase
    let supabaseTest = 'Not tested';
    try {
      const { createClient } = require('@supabase/supabase-js');
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        const { data, error } = await supabase.from('services').select('count');
        if (error) {
          supabaseTest = `Error: ${error.message}`;
        } else {
          supabaseTest = 'Connected successfully';
        }
      } else {
        supabaseTest = 'Missing environment variables';
      }
    } catch (err: any) {
      supabaseTest = `Exception: ${err.message}`;
    }

    return NextResponse.json({
      status: 'OK',
      environment: envCheck,
      supabase: supabaseTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
