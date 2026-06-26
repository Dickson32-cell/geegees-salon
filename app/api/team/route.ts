import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('[API] Team error:', error);
    return NextResponse.json({
      error: 'Failed to fetch team members',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMember = await prisma.teamMember.create({
      data: {
        name: body.name,
        title: body.title,
        bio: body.bio,
        imageUrl: body.imageUrl,
        specialties: body.specialties || [],
        active: body.active !== undefined ? body.active : true,
        displayOrder: body.displayOrder,
      }
    });
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updatedMember = await prisma.teamMember.update({
      where: { id: parseInt(id) },
      data: updates
    });
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

    await prisma.teamMember.delete({
      where: { id: id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
