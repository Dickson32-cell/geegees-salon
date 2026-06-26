import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Use a placeholder URL during build if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

// Create connection pool
const pool = new Pool({ connectionString: databaseUrl });

// Create adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const services = [
  {
    name: "Signature Cut & Style",
    category: "Hair",
    price: "₵150-250",
    duration: "60-90 min",
    description: "Expert precision cut with luxury styling session"
  },
  {
    name: "Editorial Color Experience",
    category: "Hair",
    price: "₵300-500",
    duration: "2-3 hours",
    description: "Full color transformation with premium products"
  },
  {
    name: "Luxury Deep Treatment",
    category: "Hair",
    price: "₵180",
    duration: "45 min",
    description: "Intensive conditioning and restoration therapy"
  },
  {
    name: "Bridal Hair Design",
    category: "Hair",
    price: "₵400+",
    duration: "2-4 hours",
    description: "Custom bridal styling for your special day"
  },
  {
    name: "Spa Facial Treatment",
    category: "Spa",
    price: "₵200",
    duration: "60 min",
    description: "Rejuvenating facial with premium skincare products"
  },
  {
    name: "Hot Stone Massage",
    category: "Spa",
    price: "₵250",
    duration: "90 min",
    description: "Deep relaxation with therapeutic hot stones"
  },
  {
    name: "Editorial Makeup",
    category: "Makeup",
    price: "₵300",
    duration: "90 min",
    description: "Professional makeup for events and photoshoots"
  },
  {
    name: "Bridal Makeup Package",
    category: "Makeup",
    price: "₵500+",
    duration: "2-3 hours",
    description: "Complete bridal makeup with trial session"
  },
  {
    name: "Luxury Manicure & Pedicure",
    category: "Nails",
    price: "₵120",
    duration: "60 min",
    description: "Complete nail care with gel polish"
  },
  {
    name: "Signature Box Braids",
    category: "Braids",
    price: "₵350-450",
    duration: "4-6 hours",
    description: "Expert braiding with premium extensions"
  },
  {
    name: "Knotless Braids",
    category: "Braids",
    price: "₵400-500",
    duration: "5-7 hours",
    description: "Protective styling with natural-looking finish"
  },
  {
    name: "Advanced Skincare Consultation",
    category: "Skincare",
    price: "₵150",
    duration: "30 min",
    description: "Personalized skincare analysis and treatment plan"
  }
];

async function main() {
  console.log('Starting database seed...');

  try {
    // Clear existing services
    await prisma.service.deleteMany({});
    console.log('Cleared existing services');

    // Add new services
    for (const service of services) {
      await prisma.service.create({
        data: service,
      });
      console.log(`Added service: ${service.name}`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
