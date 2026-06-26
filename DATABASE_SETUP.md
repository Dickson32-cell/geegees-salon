# Database Setup Guide for GeeGees Salon

This guide explains how to set up a production database for the GeeGees Salon website.

## Current State

The application currently uses **in-memory storage** for development, which means:
- Data is lost when the server restarts
- Not suitable for production use
- Services and content reset to defaults

## Production Database Options

### Option 1: MongoDB (Recommended for Quick Setup)

**Why MongoDB?**
- Easy to set up
- Flexible schema
- Free tier available on MongoDB Atlas
- Works well with Next.js

**Setup Steps:**

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free
   - Create a new cluster (M0 free tier is sufficient to start)

2. **Install Dependencies**
   ```bash
   npm install mongodb mongoose
   ```

3. **Create Environment Variable**
   - Create `.env.local` file in project root:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geegees-salon?retryWrites=true&w=majority
   ```

4. **Create Database Models**
   - Uncomment MongoDB section in `lib/db.ts`
   - Create models in `lib/models/`

5. **Update API Routes**
   - Replace in-memory arrays with database queries
   - Example in `app/api/services/route.ts`

### Option 2: PostgreSQL with Prisma

**Why PostgreSQL?**
- Robust and reliable
- Strong data integrity
- Great for structured data
- Prisma provides excellent TypeScript support

**Setup Steps:**

1. **Install Prisma**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```

2. **Configure Database**
   - Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/geegees?schema=public"
   ```

3. **Create Schema**
   - Edit `prisma/schema.prisma`:
   ```prisma
   model Service {
     id          Int      @id @default(autoincrement())
     name        String
     category    String
     price       String
     duration    String
     description String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }

   model WebsiteContent {
     id        Int      @id @default(autoincrement())
     page      String   @unique
     content   Json
     updatedAt DateTime @updatedAt
   }

   model Appointment {
     id        Int      @id @default(autoincrement())
     service   String
     stylist   String
     date      DateTime
     time      String
     name      String
     email     String
     phone     String
     notes     String?
     status    String   @default("pending")
     createdAt DateTime @default(now())
   }
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Update API Routes**
   - Uncomment Prisma section in `lib/db.ts`
   - Use Prisma client in API routes

### Option 3: Supabase (Fastest Setup)

**Why Supabase?**
- PostgreSQL database
- Built-in authentication
- Real-time subscriptions
- Free tier available

**Setup Steps:**

1. **Create Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Create new project

2. **Install SDK**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Create Tables**
   - Use Supabase Dashboard SQL editor
   - Run schema creation scripts

5. **Update API Routes**
   - Replace fetch calls with Supabase client calls

## Database Schema

### Services Table
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Website Content Table
```sql
CREATE TABLE website_content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100) NOT NULL UNIQUE,
  section VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  service VARCHAR(255) NOT NULL,
  stylist VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Migration from In-Memory to Database

### Step 1: Choose Your Database
Select one of the options above based on your needs

### Step 2: Set Up Database
Follow the setup steps for your chosen database

### Step 3: Update API Routes

**Before (In-Memory):**
```typescript
let services: Service[] = [...];

export async function GET() {
  return NextResponse.json(services);
}
```

**After (With Database):**
```typescript
import { prisma } from '@/lib/db';

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}
```

### Step 4: Seed Initial Data
Create a seed script to populate initial services and content

### Step 5: Test Thoroughly
- Test all CRUD operations
- Verify data persistence
- Check error handling

## Environment Variables

Create a `.env.local` file with these variables:

```env
# Database (choose one)
MONGODB_URI=your_mongodb_connection_string
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Other configurations
NODE_ENV=production
```

## Deployment Checklist

- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] Initial data is seeded
- [ ] All API routes are updated
- [ ] Data persistence is tested
- [ ] Backup strategy is in place
- [ ] Security measures are implemented (SSL, authentication)

## Need Help?

If you need assistance with database setup:
1. Check database provider documentation
2. Review Next.js database integration guides
3. Consider hiring a developer for production setup

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Enable SSL/TLS** for database connections
4. **Implement rate limiting** on API routes
5. **Validate all input** before database queries
6. **Use prepared statements** to prevent SQL injection
7. **Regular backups** of your database
8. **Monitor database** performance and errors
