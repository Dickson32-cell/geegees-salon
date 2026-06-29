# Fix Booking Error - Step by Step Guide

## The Problem
You're seeing "Failed to create appointment" because the **appointments table doesn't exist** in your Supabase database.

## The Solution - Follow These Steps EXACTLY:

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Select your project: **jqxpqrjykxmrzgtgfxpi**

### Step 2: Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Run the Database Setup Script
1. Open the file `SETUP_DATABASE.sql` (in the root of this project)
2. **Copy ALL the SQL code** from that file
3. **Paste it** into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl/Cmd + Enter)
5. Wait for it to finish (you should see "Success" message)

### Step 4: Verify Tables Were Created
1. Click on **"Table Editor"** in the left sidebar
2. You should now see these tables:
   - ✅ appointments
   - ✅ services
   - ✅ website_content
   - ✅ team_members
   - ✅ gallery_images

### Step 5: Check Environment Variables on Render
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your **geegees-salon** web service
3. Click **"Environment"** tab
4. Make sure these variables exist:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jqxpqrjykxmrzgtgfxpi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHBxcmp5a3htcnpndGdmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjA0NzQsImV4cCI6MjA5Nzk5NjQ3NH0.geJL2H29wpU1473nCsHo0q7og9EtUl8-vvlBLv0HAts
   ```
5. If missing, click **"Add Environment Variable"** and add them
6. Click **"Save Changes"** (this will trigger a redeploy)

### Step 6: Wait for Render to Redeploy
- Render will automatically redeploy after you save environment variables
- This takes about 3-5 minutes
- Watch the "Events" tab to see deployment progress

### Step 7: Test the Booking
1. Go to your website
2. Click **"Book Now"** button
3. Fill out the booking form
4. Click **"Confirm Booking"**
5. ✅ You should see "Booking Confirmed!" screen

---

## If Still Not Working...

### Check Browser Console for Errors:
1. Open your website
2. Press **F12** key
3. Click **"Console"** tab
4. Try to book again
5. Look for RED error messages
6. Send me a screenshot of those errors

### Check Render Logs:
1. Go to Render dashboard
2. Select your geegees-salon service
3. Click **"Logs"** tab
4. Try to book again
5. Look for error messages in the logs
6. Send me a screenshot

---

## What This Fix Does

✅ Creates the `appointments` table in Supabase
✅ Creates all other required tables (services, website_content, etc.)
✅ Sets up proper indexes for fast queries
✅ Adds triggers to auto-update timestamps
✅ Ensures booking works from:
   - Home page "Book Now" button
   - Services page booking
   - Navbar "Book Now" button

---

## Need Help?

If you're still stuck, send me:
1. Screenshot of Supabase Table Editor showing your tables
2. Screenshot of Render Environment Variables
3. Screenshot of browser console errors (F12 → Console)
4. Your Render app URL

I'll help you fix it immediately!
