# Quick Setup Guide - Get Services Working on Render

## What You Need to Do (5 Minutes)

Your services are already in Supabase! You just need to connect Render to Supabase.

### Step 1: Add Environment Variables to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your `geegees-salon` service

2. **Click "Environment" in the left sidebar**

3. **Add These 3 Variables:**

Click "Add Environment Variable" button for each:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://jqxpqrjykxmrzgtgfxpi.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHBxcmp5a3htcnpndGdmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjA0NzQsImV4cCI6MjA5Nzk5NjQ3NH0.geJL2H29wpU1473nCsHo0q7og9EtUl8-vvlBLv0HAts
```

**Variable 3:**
```
Name: DATABASE_URL
Value: postgresql://postgres:K0248847819o%40%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
```

4. **Click "Save Changes"**
   - Render will automatically redeploy (2-3 minutes)
   - Wait for "Live" status with green dot

### Step 2: Check Your Services

Once deployed:

1. **Go to diagnostics page:**
   ```
   https://geegees-salon.onrender.com/admin/test
   ```

   You should see:
   - ✅ Environment variables: All showing "Set"
   - ✅ Supabase connection: "Connected successfully"
   - ✅ Services endpoint: "Success - X services found"

2. **Go to services admin:**
   ```
   https://geegees-salon.onrender.com/admin/services
   ```

   Your services should be displayed!

3. **Check the main website:**
   ```
   https://geegees-salon.onrender.com/services
   ```

   Services should appear on the public page!

---

## If You Want to Use Render Database Instead

If you prefer to use Render's PostgreSQL database:

### Step 1: Get Render Database Connection String

1. Go to Render Dashboard
2. Click on your database (not the web service)
3. Find "Internal Database URL" or "External Database URL"
4. Copy the entire connection string (starts with `postgresql://`)

### Step 2: Update Environment Variables

In your web service Environment settings:

1. **Update DATABASE_URL:**
   ```
   Name: DATABASE_URL
   Value: [paste your Render database URL here]
   ```

2. **Keep the Supabase variables** OR remove them (if only using Render DB)

### Step 3: Run Database Migrations

You'll need to create the tables and add data:

1. Go to Render Dashboard → Your Database → Shell/Connect
2. Run these SQL commands:

```sql
-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT
);

-- Add sample services
INSERT INTO services (name, category, price, duration, description) VALUES
('Premium Haircut & Styling', 'Hair', '₵80', '60 min', 'Professional haircut with consultation and styling'),
('Color Treatment', 'Hair', '₵150', '120 min', 'Full color treatment with premium products'),
('Spa Manicure', 'Nails', '₵50', '45 min', 'Relaxing manicure with nail art options');
```

### Step 4: Update the Code

You'll need to switch from Supabase client to Prisma:

Let me know if you want to use Render database, and I'll help you update the code.

---

## Recommendation

**Use Supabase!** You already:
- ✅ Paid for it
- ✅ Have services loaded
- ✅ Just need to add 3 environment variables

It's the fastest way to get everything working!

---

## Need Help?

1. If environment variables don't work → Check they're spelled exactly right
2. If services don't show → Check Render logs for errors
3. If diagnostics fail → Screenshot the error and I'll help fix it

The services are already in Supabase waiting for you! Just connect Render to Supabase with those 3 environment variables.
