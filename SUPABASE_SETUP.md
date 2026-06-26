# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project: `geegees-salon`

### Database Connection String (REQUIRED)

1. Go to **Project Settings** > **Database**
2. Find **Connection string** section
3. Select **URI** tab
4. **IMPORTANT**: Use the dropdown to select **Connection pooling** = **OFF** (Session mode)
5. Copy the connection string - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. **URL Encode Special Characters in Password:**
   - `@` → `%40`
   - `!` → `%21`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `^` → `%5E`
   - `&` → `%26`
   - `*` → `%2A`
   - `.` → `%2E` (if at end of password)

### Storage API Credentials (For Image Uploads)

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://jqxpqrjykxmrzgtgfxpi.supabase.co`
   - **Project API keys** > **anon public**: Copy this key

## Step 2: Update Your .env File

```env
# Direct connection (port 5432, NOT 6543)
DATABASE_URL="postgresql://postgres:YOUR_ENCODED_PASSWORD@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres"

# Supabase API for storage
NEXT_PUBLIC_SUPABASE_URL="https://jqxpqrjykxmrzgtgfxpi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## Step 3: Create Storage Bucket for Images

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create bucket named: `salon-images`
4. Make it **Public** (check the public checkbox)
5. Click **Create bucket**

## Step 4: Set Storage Policies

1. Select the `salon-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** > **For full customization**
4. Add these policies:

### Policy 1: Allow Public Read
```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'salon-images');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'salon-images');
```

### Policy 3: Allow Authenticated Delete
```sql
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'salon-images');
```

## Step 5: Deploy to Render

1. Go to your Render dashboard
2. Select your web service
3. Go to **Environment** tab
4. Add these environment variables:
   - `DATABASE_URL`: Your encoded connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key
5. Click **Save Changes**
6. Render will automatically redeploy

## Common Issues

### "Can't reach database server"
- Make sure you're using port **5432** (NOT 6543)
- Verify your password is properly URL-encoded
- Check that your IP is not blocked (Supabase allows all by default)

### "Authentication failed"
- Double-check your password encoding
- Make sure you copied the full connection string
- Verify the database password in Supabase settings

### Services not showing
- Run migrations: `npx prisma migrate deploy`
- Check that tables exist in Supabase **Table Editor**
- Verify data exists in the `services` table
