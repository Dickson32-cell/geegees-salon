import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log('[API] Fetching team members...');
    const { data: team, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('[API] Supabase error fetching team:', error);
      return NextResponse.json({
        error: 'Failed to fetch team members',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    console.log(`[API] Fetched ${team?.length || 0} team members`);
    return NextResponse.json(team || []);
  } catch (error) {
    console.error('[API] Unexpected error fetching team:', error);
    return NextResponse.json({
      error: 'Failed to fetch team members',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[API] Creating team member with data:', {
      name: body.name,
      title: body.title,
      bio: body.bio,
      specialties: body.specialties,
      active: body.active
    });

    const { data: newMember, error } = await supabase
      .from('team_members')
      .insert([{
        name: body.name,
        title: body.title,
        bio: body.bio,
        specialties: body.specialties || [],
        active: body.active !== undefined ? body.active : true,
        display_order: body.displayOrder,
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Supabase error:', error);
      return NextResponse.json({
        error: 'Failed to create team member',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    console.log('[API] Team member created successfully:', newMember);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json({
      error: 'Failed to create team member',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Convert camelCase to snake_case for Supabase
    const dbUpdates: any = {};
    if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.specialties !== undefined) dbUpdates.specialties = updates.specialties;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    const { data: updatedMember, error } = await supabase
      .from('team_members')
      .update(dbUpdates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
    }

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
