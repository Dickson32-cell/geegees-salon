// Database connection configuration
// This file sets up database connections for production use

import { Service, WebsiteContent } from './storage';

// Example using MongoDB with Mongoose
// Uncomment and install: npm install mongoose

/*
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
*/

// Example using Prisma
// Uncomment and run: npm install @prisma/client
// Then run: npx prisma init

/*
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/

// Example using PostgreSQL with pg
// Uncomment and install: npm install pg

/*
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
*/

// For development, we'll use in-memory storage
// In production, replace with actual database calls
export const devStorage = {
  services: [] as Service[],
  content: {} as any,
};
