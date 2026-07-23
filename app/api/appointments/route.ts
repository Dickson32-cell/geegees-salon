import { NextResponse } from 'next/server';
import { supabase, withRetry } from '@/lib/supabase';
import { cache } from '@/lib/cache';

// GET all appointments
export async function GET() {
  try {
    console.log('[API] Fetching appointments via Supabase client...');

    const cacheKey = 'appointments:all';

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('[API] Returning cached appointments');
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    // Fetch from database with retry logic
    const appointments = await withRetry(async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[API] Appointments fetch error:', error);
        throw new Error(error.message);
      }

      return data || [];
    });

    // Cache the result for 1 minute (60 seconds) - shorter cache for appointments
    cache.set(cacheKey, appointments, 60);

    console.log('[API] Successfully fetched appointments:', appointments?.length || 0);
    return NextResponse.json(appointments, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
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
    if (!service || !appointmentDate || !appointmentTime || !customerName || !customerPhone) {
      console.error('[API] Missing required fields:', { service, appointmentDate, appointmentTime, customerName, customerPhone });
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'Please ensure all required fields are filled out'
        },
        { status: 400 }
      );
    }

    console.log('[API] Attempting to insert appointment with retry logic...');

    // Prepare appointment data - ensure email is never null
    const appointmentData = {
      service,
      stylist: stylist || 'Pending Assignment',
      appointment_date: new Date(appointmentDate).toISOString(),
      appointment_time: appointmentTime,
      customer_name: customerName,
      customer_email: customerEmail && customerEmail.trim() !== '' ? customerEmail.trim() : '',
      customer_phone: customerPhone,
      notes: notes && notes.trim() !== '' ? notes.trim() : '',
      status
    };

    console.log('[API] Inserting appointment data:', appointmentData);

    // Insert directly with detailed error logging
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('[API] Appointment creation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        sentData: appointmentData
      });

      return NextResponse.json({
        error: 'Failed to create appointment',
        details: error.message,
        hint: error.hint || 'Please check database permissions',
        code: error.code,
        debug: appointmentData
      }, { status: 500 });
    }

    if (!appointment) {
      console.error('[API] No appointment returned after insert');
      return NextResponse.json({
        error: 'Failed to create appointment',
        details: 'No data returned from database'
      }, { status: 500 });
    }

    // Invalidate appointments cache
    cache.delete('appointments:all');

    console.log('[API] Successfully created appointment:', appointment.id);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error('[API] Appointment creation catch error:', error);

    // Return detailed error for debugging
    return NextResponse.json({
      error: 'Failed to create appointment',
      details: error.message || String(error),
      hint: 'Please check your internet connection and try again. If the issue persists, contact support.',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
