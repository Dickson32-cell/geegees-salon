import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    console.log('[API] Fetching services via Prisma/Render PostgreSQL...');
    console.log('[API] Environment check:', {
      hasDbUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    });

    const services = await prisma.service.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    console.log('[API] Successfully fetched services:', services.length);
    return NextResponse.json(services);
  } catch (error: any) {
    console.error('[API] Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch services',
        details: error.message,
        hint: 'Make sure DATABASE_URL is set and database migrations have been run'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[API] Creating service:', body.name);

    const newService = await prisma.service.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        duration: body.duration,
        description: body.description || null,
      }
    });

    console.log('[API] Service created successfully:', newService.id);
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.error('[API] Database error creating service:', error);
    return NextResponse.json({
      error: 'Failed to create service',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    console.log('[API] Updating service:', id);

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: updates
    });

    console.log('[API] Service updated successfully:', id);
    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error('[API] Database error updating service:', error);
    return NextResponse.json({
      error: 'Failed to update service',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    console.log('[API] Deleting service:', id);

    await prisma.service.delete({
      where: { id }
    });

    console.log('[API] Service deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API] Database error deleting service:', error);
    return NextResponse.json({
      error: 'Failed to delete service',
      details: error.message
    }, { status: 500 });
  }
}
