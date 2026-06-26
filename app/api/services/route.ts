import { NextResponse } from 'next/server';
import type { Service } from '@/lib/storage';

// This would typically use a database, but we're using localStorage for simplicity
// In production, you'd connect to a database here

let services: Service[] = [
  { id: 1, name: "Women's Haircut", category: "Hair", price: "₵45-75", duration: "60 min", description: "Precision cut tailored to your style" },
  { id: 2, name: "Men's Haircut", category: "Hair", price: "₵35-50", duration: "45 min", description: "Classic and modern styles" },
  { id: 3, name: "Hair Coloring", category: "Hair", price: "₵80-200", duration: "120 min", description: "Full color, highlights, balayage" },
  { id: 4, name: "Facial Treatment", category: "Spa", price: "₵70-150", duration: "90 min", description: "Deep cleansing and rejuvenation" },
  { id: 5, name: "Body Massage", category: "Spa", price: "₵80-180", duration: "90 min", description: "Swedish, deep tissue, aromatherapy" },
  { id: 6, name: "Bridal Makeup", category: "Makeup", price: "₵150-300", duration: "120 min", description: "Complete bridal look package" },
];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newService: Service = {
    ...body,
    id: Date.now(),
  };
  services.push(newService);
  return NextResponse.json(newService, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  const index = services.findIndex(s => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    return NextResponse.json(services[index]);
  }

  return NextResponse.json({ error: 'Service not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');

  services = services.filter(s => s.id !== id);
  return NextResponse.json({ success: true });
}
