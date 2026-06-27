import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    console.log('[API] Fetching services via Supabase client...');

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('services')
      .select('*');

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: services, error } = await query.order('id', { ascending: true });

    if (error) {
      console.error('[API] Services fetch error:', error);
      return NextResponse.json({
        error: 'Failed to fetch services',
        details: error.message
      }, { status: 500 });
    }

    console.log('[API] Successfully fetched services:', services?.length || 0);
    return NextResponse.json(services || []);
  } catch (error) {
    console.error('[API] Services catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API] Creating service:', body.name);

    const { data: newService, error } = await supabase
      .from('services')
      .insert([{
        name: body.name,
        category: body.category,
        price: body.price,
        duration: body.duration,
        description: body.description || null,
        status: body.status || 'draft',
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Service creation error:', error);
      return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
    }

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('[API] Service creation catch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    console.log('[API] Updating service:', id);

    const { data: updatedService, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('[API] Service update error:', error);
      return NextResponse.json({ error: 'Failed to update service', details: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('[API] Service update catch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    console.log('[API] Deleting service:', id);

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API] Service deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete service', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Service deletion catch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
