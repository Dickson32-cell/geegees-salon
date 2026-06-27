# Supabase Setup Guide - GeeGees Salon

## Complete Setup in 3 Steps

---

## Step 1: Create Services Table in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Click on your project: **jqxpqrjykxmrzgtgfxpi**

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar (looks like a code/document icon)
   - Click **"New Query"** button

3. **Paste This SQL Code**

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
SELECT * FROM services ORDER BY id;
```

4. **Run the Query**
   - Click **"Run"** button (or press Ctrl + Enter)
   - You should see: **total_services: 10**
   - Then a list of all 10 services

---

## Step 2: Add Environment Variables to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. Click your **Web Service** (geegees-salon)
3. Click **"Environment"** in left sidebar
4. Add or update these 3 variables:

### Variable 1: DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://postgres:K0248847819o%40%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
```

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

5. **Click "Save Changes"**
6. Wait for Render to redeploy (2-3 minutes)

---

## Step 3: Verify Everything Works

After deployment completes:

1. **Visit Services Admin**
   ```
   https://geegees-salon.onrender.com/admin/services
   ```
   You should see all 10 services!

2. **Visit Public Services Page**
   ```
   https://geegees-salon.onrender.com/services
   ```
   Services displayed for customers!

3. **Visit Homepage**
   ```
   https://geegees-salon.onrender.com
   ```
   Everything working!
