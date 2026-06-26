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

// Parse connection string to extract components
const url = new URL(databaseUrl);
const poolConfig = {
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pool
const pool = globalForPrisma.pool || new Pool(poolConfig);
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
