import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(images);
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
    const newImage = await prisma.galleryImage.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        category: body.category,
        description: body.description,
        displayOrder: body.displayOrder,
      }
    });
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

    const updatedImage = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: updates
    });
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

    await prisma.galleryImage.delete({
      where: { id: id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
