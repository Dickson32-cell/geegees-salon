# GeeGees Salon - Admin Guide

## Important Changes Made

### ✅ What's Fixed
1. **Database Connection**: Now uses direct Supabase connection (port 5432) instead of pooled connection
2. **Mock Data Removed**: All hardcoded team members, gallery images, and service images removed
3. **Supabase Storage Integration**: Image uploads will now be saved directly to Supabase Storage
4. **Mobile Responsiveness**: Fixed hamburger menu and improved mobile layout

### ⚠️ What You Need To Do

## Step 1: Fix Supabase Connection

### Get Your Correct Database URL

1. Go to https://supabase.com/dashboard
2. Select your `geegees-salon` project
3. Go to **Project Settings** > **Database**
4. Scroll down to **Connection String**
5. Select **URI** tab
6. **IMPORTANT**: In the dropdown, select **Session mode** (NOT Transaction mode)
   - This uses port **5432** (direct connection)
   - NOT port 6543 (pooled connection)
7. Copy the connection string
8. Replace `[YOUR-PASSWORD]` with your actual database password

### URL Encode Your Password

If your password contains special characters, you MUST URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `.` | `%2E` |
| `!` | `%21` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `^` | `%5E` |
| `&` | `%26` |
| `*` | `%2A` |

**Example:**
- Password: `MyPass@2024..`
- Encoded: `MyPass%402024%2E%2E`
- Full URL: `postgresql://postgres:MyPass%402024%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres`

### Get Your Supabase API Keys

1. In Supabase dashboard, go to **Project Settings** > **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://jqxpqrjykxmrzgtgfxpi.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 2: Setup Supabase Storage for Images

### Create Storage Bucket

1. In Supabase dashboard, click **Storage** in the left menu
2. Click **New bucket**
3. Name: `salon-images`
4. **Check** the "Public bucket" option
5. Click **Create bucket**

### Set Storage Policies

1. Click on the `salon-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** > **For full customization**

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'salon-images');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'salon-images');
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'salon-images');
```

## Step 3: Update Environment Variables in Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your `geegees-salon` web service
3. Go to **Environment** tab
4. Update/Add these variables:

```env
DATABASE_URL=postgresql://postgres:YOUR_ENCODED_PASSWORD@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://jqxpqrjykxmrzgtgfxpi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Click **Save Changes**
6. Render will automatically redeploy your app

## Step 4: Verify Database Tables Exist

1. In Supabase, go to **Table Editor**
2. Verify these tables exist:
   - `services`
   - `gallery_images`
   - `team_members`
   - `appointments`
3. If tables don't exist, you need to run migrations (see below)

### Run Migrations (If Needed)

If your database is empty and tables don't exist:

```bash
cd geegees-salon
npx prisma migrate deploy
```

## Step 5: Add Your Content Through Admin Panel

### Add Services

1. Go to `/admin/services`
2. Click **Add New Service**
3. Fill in:
   - Service Name
   - Category
   - Price
   - Duration
   - Description
4. Click **Save**

### Add Gallery Images

1. Go to `/admin` (coming soon - needs admin UI update)
2. Upload images - they will be automatically saved to Supabase Storage
3. Add title, category, description
4. Images will appear on the Gallery page

### Add Team Members

1. Go to `/admin/team`
2. Click **Add Team Member**
3. Upload photo - saved to Supabase Storage automatically
4. Fill in name, title, bio, specialties
5. Team members will appear on Team page

## How Image Uploads Work

When you upload an image through the admin panel:

1. **Image is uploaded** to Supabase Storage bucket `salon-images`
2. **Supabase generates** a public URL for the image
3. **URL is saved** to your PostgreSQL database
4. **Image displays** on your website from Supabase CDN

**Benefits:**
- ✅ Fast CDN delivery
- ✅ No storage limits (Supabase free tier: 1GB)
- ✅ Automatic image optimization
- ✅ Secure access control
- ✅ Easy to manage in Supabase dashboard

## Troubleshooting

### Services Not Showing

**Check:**
1. Is `DATABASE_URL` set in Render?
2. Did you use port **5432** (not 6543)?
3. Is your password properly URL-encoded?
4. Do you have data in the `services` table?

**Test Locally:**
```bash
cd geegees-salon
npx tsx test-db.ts
```

### Images Not Uploading

**Check:**
1. Is `NEXT_PUBLIC_SUPABASE_URL` set?
2. Is `NEXT_PUBLIC_SUPABASE_ANON_KEY` set?
3. Does the `salon-images` bucket exist?
4. Are storage policies configured?

### Can't Connect to Database

**Error: "Can't reach database server"**
- Your password has special characters that aren't URL-encoded
- You're using port 6543 instead of 5432
- Check your internet/firewall

**Error: "Authentication failed"**
- Your password is incorrect
- Check the password in Supabase Settings > Database

## Next Steps

1. ✅ Fix your `.env` file locally with correct credentials
2. ✅ Update Render environment variables
3. ✅ Create Supabase storage bucket
4. ✅ Set storage policies
5. ✅ Add your services through admin panel
6. ✅ Upload team photos and gallery images
7. ✅ Test everything works!

## Need Help?

- Check `SUPABASE_SETUP.md` for detailed Supabase configuration
- Review Render logs if deployment fails
- Test database connection locally first
