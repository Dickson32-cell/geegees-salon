# Deploy GeeGees Salon to Render - Complete Guide

## Architecture Overview

- **Render PostgreSQL**: Used for services (via Prisma ORM)
- **Supabase**: Used for bookings and media storage (images, videos)

---

## Step 1: Add Services to Database (Do This First!)

### Open Render Database Shell

1. Go to: https://dashboard.render.com
2. Click on your **PostgreSQL database** (geegees_salon)
3. Click **"Shell"** tab

### Run This SQL Command

Copy and paste this entire block:

```sql
-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add 10 sample services
INSERT INTO services (name, category, price, duration, description, updated_at) VALUES
('Premium Haircut & Styling', 'Hair', '₵80', '60 min', 'Professional haircut with consultation and styling', CURRENT_TIMESTAMP),
('Color Treatment', 'Hair', '₵150', '120 min', 'Full color treatment with premium products', CURRENT_TIMESTAMP),
('Balayage Highlights', 'Hair', '₵200', '180 min', 'Hand-painted highlights for natural dimension', CURRENT_TIMESTAMP),
('Keratin Treatment', 'Hair', '₵180', '150 min', 'Smoothing treatment for frizz-free hair', CURRENT_TIMESTAMP),
('Deep Tissue Massage', 'Spa', '₵120', '90 min', 'Therapeutic massage for muscle tension relief', CURRENT_TIMESTAMP),
('Facial Treatment', 'Skincare', '₵90', '60 min', 'Deep cleansing and hydrating facial', CURRENT_TIMESTAMP),
('Bridal Makeup', 'Makeup', '₵250', '120 min', 'Complete bridal makeup with trial session', CURRENT_TIMESTAMP),
('Gel Manicure', 'Nails', '₵60', '45 min', 'Long-lasting gel polish with nail art', CURRENT_TIMESTAMP),
('Box Braids', 'Braids', '₵150', '240 min', 'Protective styling with premium extensions', CURRENT_TIMESTAMP),
('Pedicure & Spa', 'Nails', '₵70', '60 min', 'Relaxing pedicure with foot massage', CURRENT_TIMESTAMP);

-- Verify services were added
SELECT COUNT(*) as total_services FROM services;
```

You should see: `total_services: 10` ✅

---

## Step 2: Add Environment Variables to Render Web Service

1. Go to Render Dashboard
2. Click on your **Web Service** (geegees-salon)
3. Click **"Environment"** in left sidebar
4. Add these 3 environment variables:

### Variable 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://geegees_salon_user:BrZaI0QX8Dml94XNt0gGchxVRakAxt2v@dpg-d8vfhjtaeets73d0630g-a/geegees_salon
```
**IMPORTANT:** Use the **INTERNAL Database URL** (not External!)
*(Get from: Database → Connections → Internal Database URL)*

### Variable 2: NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://jqxpqrjykxmrzgtgfxpi.supabase.co
```

### Variable 3: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHBxcmp5a3htcnpndGdmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjA0NzQsImV4cCI6MjA5Nzk5NjQ3NH0.geJL2H29wpU1473nCsHo0q7og9EtUl8-vvlBLv0HAts
```

5. Click **"Save Changes"**
6. Wait for automatic redeployment (2-3 minutes)

---

## Step 3: Verify Everything Works

### After deployment completes:

1. **Check Services Admin:**
   ```
   https://geegees-salon.onrender.com/admin/services
   ```
   You should see all 10 services! ✅

2. **Check Public Services Page:**
   ```
   https://geegees-salon.onrender.com/services
   ```
   Services should be visible to customers! ✅

3. **Check Diagnostics (Optional):**
   ```
   https://geegees-salon.onrender.com/admin/test
   ```
   All environment variables should show as "Set" ✅

---

## How It Works

### Services (Render PostgreSQL + Prisma)
- All service CRUD operations use Prisma
- Data stored in Render PostgreSQL
- Managed via `/admin/services`
- Displayed on `/services` page

### Bookings & Media (Supabase - Future)
- Appointment bookings will use Supabase
- Gallery images/videos will use Supabase Storage
- Team member photos will use Supabase Storage

---

## Troubleshooting

### Services not showing?
1. Check Render logs: Dashboard → Your Service → "Logs"
2. Verify DATABASE_URL is set correctly
3. Make sure you ran the SQL commands in Step 1
4. Check the services table exists: `SELECT * FROM services;` in database shell

### Build failing?
1. Check all 3 environment variables are set
2. Make sure you're using the **Internal** Database URL (simpler format without region)
3. Check for any missing dependencies

### Database connection errors?
1. Use the **Internal Database URL** (not External) for Render web service
2. Internal URL format: `postgresql://user:pass@dpg-xxxxx/database` (no region, no port)
3. Make sure database and web service are both running
4. Verify the database is in "Available" status

---

## Adding More Services

You can add services through the admin panel:

1. Go to: https://geegees-salon.onrender.com/admin/services
2. Click **"Add Service"** button
3. Fill in the form:
   - Service Name
   - Category (Hair, Spa, Makeup, Skincare, Nails, Braids)
   - Price (e.g., "₵50-80")
   - Duration (e.g., "60 min")
   - Description (optional)
4. Click **"Add Service"**
5. Success! Service appears immediately

---

## Support

If you encounter issues:
1. Check Render deployment logs
2. Verify all environment variables
3. Test the database connection in database shell
4. Check the `/admin/test` diagnostics page
