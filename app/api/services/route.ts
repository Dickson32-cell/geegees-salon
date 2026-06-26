import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('[API] Fetching services...');
    console.log('[API] DATABASE_URL set:', !!process.env.DATABASE_URL);

    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' }
    });

    console.log('[API] Found services:', services.length);
    return NextResponse.json(services);
  } catch (error) {
    console.error('[API] Database error:', error);
    console.error('[API] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({
      error: 'Failed to fetch services',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newService = await prisma.service.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        duration: body.duration,
        description: body.description,
      }
    });
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: updates
    });
    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    await prisma.service.delete({
      where: { id: id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
