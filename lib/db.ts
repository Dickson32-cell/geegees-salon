import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Require DATABASE_URL to be set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Use Supabase connection pooler (port 6543) for better compatibility with serverless
// Replace the port in the DATABASE_URL before Prisma uses it
process.env.DATABASE_URL = process.env.DATABASE_URL.replace(':5432/', ':6543/');

// Create Prisma Client with native connection (no adapter)
// This avoids IPv6 issues that occur with the pg adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
