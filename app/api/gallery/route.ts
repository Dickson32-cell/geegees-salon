import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Gallery error:', error);
      return NextResponse.json({
        error: 'Failed to fetch gallery images',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json(images || []);
  } catch (error) {
    console.error('[API] Gallery error:', error);
    return NextResponse.json({
      error: 'Failed to fetch gallery images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: newImage, error } = await supabase
      .from('gallery_images')
      .insert([{
        title: body.title,
        image_url: body.imageUrl,
        category: body.category,
        description: body.description,
        display_order: body.displayOrder,
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
    }

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Convert camelCase to snake_case for Supabase
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;

    const { data: updatedImage, error } = await supabase
      .from('gallery_images')
      .update(dbUpdates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
    }

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
