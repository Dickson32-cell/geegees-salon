import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Require DATABASE_URL to be set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Use Supabase connection pooler (port 6543) - it only supports IPv4
const databaseUrl = process.env.DATABASE_URL.replace(':5432/', ':6543/');

// Create connection pool with IPv4 forced
const pool = globalForPrisma.pool || new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Force IPv4 - this is the key to fixing the ENETUNREACH error on Render
  family: 4,
  ssl: {
    rejectUnauthorized: false
  }
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
