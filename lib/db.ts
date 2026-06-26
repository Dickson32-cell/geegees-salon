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

const databaseUrl = process.env.DATABASE_URL;

// Use connection pooler URL (port 6543 with pgbouncer) to avoid IPv6 issues
// Supabase's connection pooler only uses IPv4
const poolerUrl = databaseUrl.replace(':5432/', ':6543/').replace('postgres?', 'postgres?pgbouncer=true&');

// Create connection pool using the pooler
const pool = globalForPrisma.pool || new Pool({
  connectionString: poolerUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
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
