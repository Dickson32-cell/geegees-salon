import { NextResponse } from 'next/server';
import { supabase, withRetry } from '@/lib/supabase';
import { cache } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    console.log('[API] Fetching services via Supabase client...');

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Create cache key based on status filter
    const cacheKey = `services:${status || 'all'}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('[API] Returning cached services');
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Fetch from database with retry logic
    const services = await withRetry(async () => {
      let query = supabase
        .from('services')
        .select('*');

      // Filter by status if provided
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('id', { ascending: true });

      if (error) {
        console.error('[API] Services fetch error:', error);
        throw new Error(error.message);
      }

      return data || [];
    });

    // Cache the result for 5 minutes (300 seconds)
    cache.set(cacheKey, services, 300);

    console.log('[API] Successfully fetched services:', services?.length || 0);
    return NextResponse.json(services, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
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
        image_url: body.imageUrl || null, // Convert camelCase to snake_case for DB
        status: body.status || 'draft',
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Service creation error:', error);
      return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
    }

    // Invalidate cache when new service is created
    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

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

    // Convert camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
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
      console.error('[API] Service update error:', error);
      return NextResponse.json({ error: 'Failed to update service', details: error.message }, { status: 500 });
    }

    // Invalidate cache when service is updated
    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

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

    // Invalidate cache when service is deleted
    cache.delete('services:all');
    cache.delete('services:published');
    cache.delete('services:draft');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Service deletion catch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
