# Render PostgreSQL Database Setup Guide

## Quick Setup (Follow These Steps)

### Step 1: Get Your Render Database URL

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click on your PostgreSQL database** (not the web service)
3. **Copy the "Internal Database URL"** - it looks like:
   ```
   postgresql://username:password@hostname.render.com/database_name
   ```
   ⚠️ Make sure to copy the **Internal** URL (not External)

### Step 2: Add Database URL to Your Web Service

1. **Go back to Render Dashboard**
2. **Click on your web service** (geegees-salon)
3. **Click "Environment" in the left sidebar**
4. **Find or add "DATABASE_URL" variable:**
   - If it exists: Click edit and paste your database URL
   - If it doesn't exist: Click "Add Environment Variable"
     - Key: `DATABASE_URL`
     - Value: [paste your database URL from Step 1]
5. **Click "Save Changes"**
6. **Wait for automatic redeployment** (2-3 minutes)

### Step 3: Run Database Migration

After the deployment completes:

1. **Go to your web service in Render Dashboard**
2. **Click "Shell" in the left sidebar**
3. **Run this command:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Wait for it to complete** - you should see:
   ```
   ✔ Generated Prisma Client
   ✔ Applied migration(s)
   ```

### Step 4: Verify Services Are Working

1. **Visit diagnostics page:**
   ```
   https://geegees-salon.onrender.com/admin/test
   ```
   Should show DATABASE_URL is set

2. **Visit services admin:**
   ```
   https://geegees-salon.onrender.com/admin/services
   ```
   You should see 10 sample services already loaded!

3. **Visit public services page:**
   ```
   https://geegees-salon.onrender.com/services
   ```
   Services should be visible to customers!

---

## What Changed?

✅ **Switched from Supabase to Render PostgreSQL**
✅ **Using Prisma ORM** (more reliable)
✅ **10 sample services included** in the migration
✅ **Better error messages** for debugging

---

## Add Your Own Services

1. Go to: https://geegees-salon.onrender.com/admin/services
2. Click "Add Service" button
3. Fill in:
   - Service Name
   - Category (Hair, Spa, Makeup, Skincare, Nails, Braids)
   - Price (e.g., "₵50-80")
   - Duration (e.g., "60 min")
   - Description (optional)
4. Click "Add Service"
5. Green success message appears!

---

## Troubleshooting

### Error: "DATABASE_URL not set"
- Make sure you added DATABASE_URL to your web service environment variables
- Use the **Internal** database URL, not External
- Save changes and wait for redeployment

### Error: "Table does not exist"
- Run the migration: `npx prisma migrate deploy` in Shell
- Make sure migration completed successfully

### Services not showing
- Check Render logs: Dashboard → Your Service → "Logs" tab
- Look for database connection errors
- Verify DATABASE_URL is correct

### Can't connect to database
- Make sure you're using the Internal URL
- Check that the database is running (green status in Render)
- Verify the web service and database are in the same region

---

## Important Notes

⚠️ **No More Supabase Variables Needed:**
- You can remove `NEXT_PUBLIC_SUPABASE_URL`
- You can remove `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Only `DATABASE_URL` is required now

✅ **Sample Data Included:**
- Migration includes 10 sample services
- You can edit or delete them
- Add your own services through admin panel

🔒 **Secure:**
- Internal database URL only works within Render
- No public access to your database
- Prisma handles SQL injection prevention

---

## Quick Reference

**Admin Panel:** https://geegees-salon.onrender.com/admin

**Add Services:** https://geegees-salon.onrender.com/admin/services

**Diagnostics:** https://geegees-salon.onrender.com/admin/test

**Run Migration:** In Render Shell → `npx prisma migrate deploy`

**Check Logs:** Dashboard → Your Service → "Logs" tab
