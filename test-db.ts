import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗');

    // Import prisma AFTER environment variables are loaded
    const { prisma } = await import('./lib/db');

    const services = await prisma.service.findMany();
    console.log('Services found:', services.length);
    console.log('Services:', JSON.stringify(services, null, 2));

    await prisma.$disconnect();
    console.log('\n✓ Database connection successful!');
  } catch (error) {
    console.error('\n✗ Database error:', error);
    process.exit(1);
  }
}

testConnection();
