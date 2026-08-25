import { NextResponse } from 'next/server';
import { supabase, withRetry } from '@/lib/supabase';
import { cache } from '@/lib/cache';

// GET public services (public endpoint — safe, no sensitive data)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';

    const cacheKey = `services:${status}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    const services = await withRetry(async () => {
      let query = supabase.from('services').select('*');
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query.order('id', { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    });

    cache.set(cacheKey, services, 300);

    return NextResponse.json(services, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API] Services fetch error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create service — requires admin auth
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: newService, error } = await supabase
      .from('services')
      .insert([{
        name: body.name,
        category: body.category,
        subcategory: body.subcategory || null,
        price: body.price,
        duration: body.duration,
        description: body.description || null,
        image_url: body.imageUrl || null,
        status: body.status || 'draft',
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Service creation error');
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('[API] Service creation error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update service — requires admin auth
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory || null;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { data: updatedService, error } = await supabase
      .from('services')
      .update(dbUpdates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('[API] Service update error');
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      );
    }

    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('[API] Service update error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE service — requires admin auth
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API] Service deletion error');
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      );
    }

    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Service deletion error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}