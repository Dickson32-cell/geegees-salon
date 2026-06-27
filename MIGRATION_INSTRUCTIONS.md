# Migration Instructions: Add Status Field to Services

This migration adds a `status` field to the services table to control which services are visible on the main website.

## What Changed

- **Schema Update**: Added `status` field to Service model (values: `draft`, `published`, `inactive`)
- **API Update**: Services API now supports filtering by status (`/api/services?status=published`)
- **Admin Interface**: Admin can now set service status when creating/editing services
- **Public Website**: Only shows services with `status='published'`

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and paste the following SQL:

```sql
-- Add status column to services table
ALTER TABLE "services" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';

-- Update existing services to 'published' status so they remain visible
UPDATE "services" SET "status" = 'published' WHERE "status" = 'draft';
```

5. Click **Run** to execute the migration

### Option 2: Using Prisma Migrate (If connected to database)

```bash
npx prisma migrate deploy
```

### Option 3: Using the migration script

```bash
npx tsx scripts/apply-migration.ts
```

This will display the SQL that needs to be run in your Supabase dashboard.

## After Migration

1. All existing services will be set to `published` status (visible on website)
2. New services will default to `draft` status (hidden from website)
3. Admins can change service status in the admin panel at `/admin/services`

## Status Values

- **draft**: Service is hidden from the public website (new services default to this)
- **published**: Service is visible on the public website
- **inactive**: Service is hidden from the public website (for temporarily disabled services)

## Testing

After applying the migration:

1. Visit `/admin/services` to manage services
2. Create a new service (defaults to `draft` status)
3. Check that it doesn't appear on `/services` (public page)
4. Change the status to `published`
5. Verify it now appears on `/services`
