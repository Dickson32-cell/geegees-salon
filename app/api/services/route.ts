import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[API] Missing Supabase credentials:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    throw new Error('Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Render environment settings.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    console.log('[API] Fetching services via Supabase client...');
    console.log('[API] Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });

    const supabase = getSupabaseClient();

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log('[API] Successfully fetched services:', services?.length || 0);
    return NextResponse.json(services || []);
  } catch (error: any) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    console.log('[API] Creating service:', body.name);

    const { data: newService, error } = await supabase
      .from('services')
      .insert([{
        name: body.name,
        category: body.category,
        price: body.price,
        duration: body.duration,
        description: body.description,
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Supabase error creating service:', error);
      return NextResponse.json({
        error: 'Failed to create service',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log('[API] Service created successfully:', newService.id);
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.error('[API] Database error:', error);
    return NextResponse.json({
      error: 'Failed to create service',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const supabase = getSupabaseClient();

    console.log('[API] Updating service:', id);

    const { data: updatedService, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('[API] Supabase error updating service:', error);
      return NextResponse.json({
        error: 'Failed to update service',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log('[API] Service updated successfully:', id);
    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error('[API] Database error:', error);
    return NextResponse.json({
      error: 'Failed to update service',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const supabase = getSupabaseClient();

    console.log('[API] Deleting service:', id);

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API] Supabase error deleting service:', error);
      return NextResponse.json({
        error: 'Failed to delete service',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log('[API] Service deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API] Database error:', error);
    return NextResponse.json({
      error: 'Failed to delete service',
      details: error.message
    }, { status: 500 });
  }
}
