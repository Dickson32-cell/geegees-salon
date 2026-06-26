# Quick Start Guide - Step by Step

Follow these steps IN ORDER to get your website working properly.

---

## STEP 1: Get Your Correct Database URL from Supabase

### 1.1 Login to Supabase
1. Open your browser and go to: **https://supabase.com/dashboard**
2. Login with your account
3. You should see your project `geegees-salon` - click on it

### 1.2 Get the Direct Connection String
1. On the left sidebar, click the **gear icon ⚙️** at the bottom (Project Settings)
2. Click on **Database** in the settings menu
3. Scroll down to the section called **Connection string**
4. You'll see tabs: **URI**, **JDBC**, etc. - Click on **URI**
5. Look for a dropdown that says "Connection pooling" or "Mode"
   - **IMPORTANT**: Select **"Session mode"** or turn OFF "Connection pooling"
   - This will show port **5432** (NOT 6543)
6. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
   ```

### 1.3 Get Your Database Password
1. Still on the Database page, look for **Database Password**
2. Your password is: `K0248847819o@..`
3. We need to URL-encode the special characters:
   - The `@` symbol becomes `%40`
   - Each `.` becomes `%2E`
4. **Your encoded password is**: `K0248847819o%40%2E%2E`

### 1.4 Your Final DATABASE_URL
Copy this entire line (replace the password part):
```
postgresql://postgres:K0248847819o%40%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
```

**✅ CHECKPOINT**: Make sure the URL has:
- Port `:5432` (NOT :6543)
- Password with `%40` instead of `@`
- Password with `%2E%2E` instead of `..`

---

## STEP 2: Get Your Supabase API Credentials

### 2.1 Go to API Settings
1. Still in Supabase dashboard (left sidebar)
2. Click the **gear icon ⚙️** (Project Settings)
3. Click on **API**

### 2.2 Copy Your Project URL
1. Look for **Project URL** or **API URL**
2. Copy this value:
   ```
   https://jqxpqrjykxmrzgtgfxpi.supabase.co
   ```

### 2.3 Copy Your Anon Key
1. On the same API page, scroll down to **Project API keys**
2. Find the **anon** **public** key
3. It's a very long string starting with `eyJ...`
4. Click the **Copy** button next to it
5. Save it somewhere temporarily (Notepad)

**✅ CHECKPOINT**: You should now have:
- Project URL: `https://jqxpqrjykxmrzgtgfxpi.supabase.co`
- Anon Key: `eyJ...` (long string)

---

## STEP 3: Create Supabase Storage Bucket

### 3.1 Navigate to Storage
1. In Supabase dashboard (left sidebar)
2. Click on **Storage** (📦 icon)
3. You'll see a list of buckets (might be empty)

### 3.2 Create New Bucket
1. Click the **"New bucket"** button (top right)
2. Fill in the form:
   - **Name**: `salon-images` (exactly this, no spaces)
   - **Public bucket**: ✅ **Check this box** (IMPORTANT!)
   - **File size limit**: Leave default (50MB is fine)
   - **Allowed MIME types**: Leave empty (allows all image types)
3. Click **"Create bucket"**

### 3.3 Set Up Storage Policies
1. Click on your new `salon-images` bucket
2. Click the **"Policies"** tab at the top
3. You should see "No policies created yet"
4. Click **"New Policy"** button
5. Click **"For full customization"**

**Policy 1: Allow Public Reading**
1. Policy name: `Public read access`
2. Allowed operation: Check **SELECT**
3. Target roles: Select **public**
4. SQL editor will appear. Paste this:
   ```sql
   bucket_id = 'salon-images'
   ```
5. Click **"Review"** then **"Save policy"**

**Policy 2: Allow Authenticated Upload** (Optional - for admin uploads)
1. Click **"New Policy"** again
2. Policy name: `Authenticated upload`
3. Allowed operation: Check **INSERT**
4. Target roles: Select **authenticated**
5. SQL editor, paste:
   ```sql
   bucket_id = 'salon-images'
   ```
6. Click **"Review"** then **"Save policy"**

**Policy 3: Allow Authenticated Delete** (Optional - for admin)
1. Click **"New Policy"** again
2. Policy name: `Authenticated delete`
3. Allowed operation: Check **DELETE**
4. Target roles: Select **authenticated**
5. SQL editor, paste:
   ```sql
   bucket_id = 'salon-images'
   ```
6. Click **"Review"** then **"Save policy"**

**✅ CHECKPOINT**: You should now have:
- A bucket named `salon-images` (marked as public)
- At least one policy for public read access

---

## STEP 4: Update Render Environment Variables

### 4.1 Login to Render
1. Go to: **https://dashboard.render.com**
2. Login with your account
3. Find your service `geegees-salon` and click on it

### 4.2 Update Environment Variables
1. Click on **"Environment"** in the left menu
2. You'll see your existing environment variables

### 4.3 Update DATABASE_URL
1. Find `DATABASE_URL` in the list
2. Click the **pencil icon** (edit) next to it
3. **Delete the old value**
4. **Paste the new value**:
   ```
   postgresql://postgres:K0248847819o%40%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres
   ```

### 4.4 Add NEXT_PUBLIC_SUPABASE_URL
1. Click **"Add Environment Variable"** button
2. **Key**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://jqxpqrjykxmrzgtgfxpi.supabase.co`
4. Click **"Add"** or **"Save"**

### 4.5 Add NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Click **"Add Environment Variable"** again
2. **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value**: Paste your long anon key (starts with `eyJ...`)
4. Click **"Add"** or **"Save"**

### 4.6 Save and Deploy
1. Click **"Save Changes"** button at the bottom
2. Render will automatically start redeploying your app
3. Wait for deployment to complete (2-5 minutes)
4. You'll see "Live" with a green dot when it's done

**✅ CHECKPOINT**: Your Render dashboard should show:
- DATABASE_URL (updated)
- NEXT_PUBLIC_SUPABASE_URL (new)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (new)

---

## STEP 5: Add Services Through Admin Panel

### 5.1 Access Admin Panel
1. Go to your website: **https://geegees-salon.onrender.com/admin/services**
2. Login with admin credentials (if prompted)

### 5.2 Add a New Service
1. Click **"Add New Service"** or **"Create Service"** button
2. Fill in the form:
   - **Service Name**: e.g., "Hair Cut & Styling"
   - **Category**: e.g., "Hair Services"
   - **Price**: e.g., "$50"
   - **Duration**: e.g., "60 mins"
   - **Description**: e.g., "Professional haircut with styling"
3. Click **"Save"** or **"Create Service"**

### 5.3 Verify Service Appears
1. Go to: **https://geegees-salon.onrender.com/services**
2. You should see your new service displayed
3. If not, check browser console for errors (F12)

**Repeat for all your services!**

---

## STEP 6: Add Team Members (Optional)

### 6.1 Access Team Admin
1. Go to: **https://geegees-salon.onrender.com/admin/team**

### 6.2 Add Team Member
1. Click **"Add Team Member"** button
2. Fill in:
   - **Name**: e.g., "Sarah Johnson"
   - **Title**: e.g., "Master Stylist"
   - **Bio**: Short description
   - **Specialties**: Add skills (comma-separated)
   - **Photo**: Upload image (will save to Supabase automatically)
3. Click **"Save"**

### 6.3 Verify on Website
1. Go to: **https://geegees-salon.onrender.com/team**
2. Your team member should appear

---

## STEP 7: Add Gallery Images (When Admin UI Ready)

The gallery admin interface may need to be created. For now, you can add images directly through Supabase:

### Manual Method:
1. Go to Supabase → Storage → `salon-images`
2. Click **"Upload file"**
3. Upload your image
4. Copy the public URL
5. Go to Supabase → Table Editor → `gallery_images`
6. Click **"Insert row"**
7. Fill in:
   - **title**: Image title
   - **imageUrl**: Paste the URL
   - **category**: e.g., "color", "cut", "style"
   - **description**: Optional
8. Click **"Save"**

---

## Troubleshooting

### Services Still Not Showing?

**Test Database Connection:**
```bash
cd geegees-salon
npx tsx test-db.ts
```

If you see errors:
- **"Can't reach database"** → Check DATABASE_URL, use port 5432
- **"Authentication failed"** → Check password encoding

### Check Render Logs
1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for errors about database connection

### Still Having Issues?
1. Check all environment variables are set in Render
2. Make sure DATABASE_URL uses port **5432** not 6543
3. Verify password is URL-encoded
4. Check that tables exist in Supabase (Table Editor)

---

## Summary Checklist

- [ ] Got correct DATABASE_URL from Supabase (port 5432)
- [ ] Got Supabase Project URL
- [ ] Got Supabase Anon Key
- [ ] Created `salon-images` bucket (public)
- [ ] Set up storage policies
- [ ] Updated DATABASE_URL in Render
- [ ] Added NEXT_PUBLIC_SUPABASE_URL in Render
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY in Render
- [ ] Waited for Render to redeploy
- [ ] Added services through admin panel
- [ ] Verified services show on website

**Once all checkboxes are complete, your website should be fully functional! 🎉**
