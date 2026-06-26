import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    checks: {}
  };

  try {
    // Test 1: Can we connect to the database?
    diagnostics.checks.connection = 'testing...';
    await prisma.$connect();
    diagnostics.checks.connection = 'success';

    // Test 2: Can we query the services table?
    diagnostics.checks.servicesTable = 'testing...';
    const count = await prisma.service.count();
    diagnostics.checks.servicesTable = `success (${count} services)`;
    diagnostics.servicesCount = count;

    // Test 3: Can we fetch a sample service?
    if (count > 0) {
      const sample = await prisma.service.findFirst();
      diagnostics.checks.sampleService = sample ? 'success' : 'no data';
      diagnostics.sampleService = sample;
    }

    diagnostics.status = 'healthy';
  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.error = {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 3)
    };
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.status === 'healthy' ? 200 : 500
  });
}
