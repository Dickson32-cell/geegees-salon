import { NextResponse } from 'next/server';
import { supabase, withRetry } from '@/lib/supabase';
import { cache } from '@/lib/cache';

// GET all appointments
// Public endpoint: returns ONLY non-sensitive fields (no customer PII)
// Admin dashboard uses Supabase client directly with RLS for full data
export async function GET() {
  try {
    const cacheKey = 'appointments:public';

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    const appointments = await withRetry(async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, service, stylist, appointment_date, appointment_time, status')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    });

    // Return only safe fields — NO customer_name, customer_email, customer_phone, notes
    const safeAppointments = appointments.map((apt: any) => ({
      id: apt.id,
      service: apt.service,
      stylist: apt.stylist,
      date: apt.appointment_date,
      time: apt.appointment_time,
      status: apt.status,
    }));

    cache.set(cacheKey, safeAppointments, 60);

    return NextResponse.json(safeAppointments, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[API] Appointments fetch error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new appointment (public — customers book appointments)
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

    // Validation
    if (!service || !appointmentDate || !appointmentTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('[API] Appointment creation error:', error.message);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    if (!appointment) {
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // Invalidate cache
    cache.delete('appointments:public');

    // Return only safe fields (no PII in response)
    return NextResponse.json(
      {
        id: appointment.id,
        service: appointment.service,
        stylist: appointment.stylist,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        status: appointment.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Appointment creation error');
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}