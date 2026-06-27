import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    // Test query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log('✅ Database info:', result);

    await prisma.$disconnect();
    console.log('✅ Connection test completed!');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n📋 Please check:');
    console.error('1. Is the DATABASE_URL correct in .env file?');
    console.error('2. Is the database server running?');
    console.error('3. Is the hostname complete (should end with .render.com)?');
    process.exit(1);
  }
}

testConnection();
