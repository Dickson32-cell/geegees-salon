import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all appointments
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
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

    // Validation
    if (!service || !stylist || !appointmentDate || !appointmentTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        service,
        stylist,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        notes: notes || '',
        status
      }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
