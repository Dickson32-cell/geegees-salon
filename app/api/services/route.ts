import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Supabase client directly - bypasses Prisma/pg adapter IPv6 issues
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log('[API] Fetching services via Supabase client...');

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services', details: error.message },
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
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data: updatedService, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
