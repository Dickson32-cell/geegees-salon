import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET single appointment
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log('[API] Fetching appointment:', id);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[API] Appointment fetch error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      return NextResponse.json({
        error: 'Failed to fetch appointment',
        details: error.message
      }, { status: 500 });
    }

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[API] Appointment catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH update appointment (status, revenue, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    console.log('[API] Updating appointment:', id);

    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.revenue !== undefined) {
      updateData.revenue = body.revenue;
    }

    if (body.finalPrice !== undefined) {
      updateData.final_price = body.finalPrice;
    }

    if (body.serviceId !== undefined) {
      updateData.service_id = body.serviceId;
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API] Appointment update error:', error);
      return NextResponse.json({
        error: 'Failed to update appointment',
        details: error.message
      }, { status: 500 });
    }

    console.log('[API] Successfully updated appointment:', id);
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[API] Appointment update catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE appointment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log('[API] Deleting appointment:', id);

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API] Appointment deletion error:', error);
      return NextResponse.json({
        error: 'Failed to delete appointment',
        details: error.message
      }, { status: 500 });
    }

    console.log('[API] Successfully deleted appointment:', id);
    return NextResponse.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('[API] Appointment deletion catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
