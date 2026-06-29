import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all appointments
export async function GET() {
  try {
    console.log('[API] Fetching appointments via Supabase client...');

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Appointments fetch error:', error);
      return NextResponse.json({
        error: 'Failed to fetch appointments',
        details: error.message
      }, { status: 500 });
    }

    console.log('[API] Successfully fetched appointments:', appointments?.length || 0);
    return NextResponse.json(appointments || []);
  } catch (error) {
    console.error('[API] Appointments catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST create new appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      service,
      stylist,
      appointmentDate,
      appointmentTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      status = 'pending'
    } = body;

    console.log('[API] Creating appointment for:', customerName);
    console.log('[API] Appointment data:', { service, stylist, appointmentDate, appointmentTime });

    // Validation
    if (!service || !stylist || !appointmentDate || !appointmentTime || !customerName || !customerPhone) {
      console.error('[API] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check Supabase connection
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[API] Supabase environment variables missing!');
      return NextResponse.json({
        error: 'Database configuration error',
        details: 'Supabase environment variables are not set'
      }, { status: 500 });
    }

    console.log('[API] Attempting to insert appointment...');

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([{
        service,
        stylist,
        appointment_date: new Date(appointmentDate).toISOString(),
        appointment_time: appointmentTime,
        customer_name: customerName,
        customer_email: customerEmail || '',
        customer_phone: customerPhone,
        notes: notes || '',
        status
      }])
      .select()
      .single();

    if (error) {
      console.error('[API] Appointment creation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      return NextResponse.json({
        error: 'Failed to create appointment',
        details: error.message,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
    }

    console.log('[API] Successfully created appointment:', appointment.id);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error('[API] Appointment creation catch error:', error);
    // Return detailed error for debugging
    return NextResponse.json({
      error: 'Failed to create appointment',
      details: error.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
