# Deploy GeeGees Salon to Render

## Quick Setup Guide

### Step 1: Configure Environment Variables on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your `geegees-salon` service
3. Click **"Environment"** in the left sidebar
4. Add these **3 environment variables**:

```
DATABASE_URL
postgresql://postgres:K0248847819o%40%2E%2E@db.jqxpqrjykxmrzgtgfxpi.supabase.co:5432/postgres

NEXT_PUBLIC_SUPABASE_URL
https://jqxpqrjykxmrzgtgfxpi.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHBxcmp5a3htcnpndGdmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjA0NzQsImV4cCI6MjA5Nzk5NjQ3NH0.geJL2H29wpU1473nCsHo0q7og9EtUl8-vvlBLv0HAts
```

5. Click **"Save Changes"**
6. Render will automatically redeploy (wait 2-5 minutes)

### Step 2: Add Services via Admin Panel

Once deployment completes:

1. Visit the admin panel: `https://geegees-salon.onrender.com/admin`
   - You'll see a dashboard with all admin options
   - Click on the **"Services"** card

2. On the Services page, click **"Add Service"** button

3. Fill in service details:
   - **Service Name** (e.g., "Premium Haircut & Styling")
   - **Category** - Choose from: Hair, Spa, Makeup, Skincare, Nails, Braids
   - **Price** (e.g., "₵50-80" or "$85")
   - **Duration** (e.g., "60 min")
   - **Description** (optional)

4. Click **"Add Service"**

5. Repeat for all your services

**Direct link to Services admin:** `https://geegees-salon.onrender.com/admin/services`

### Step 3: Verify Services Appear

1. **Homepage**: Visit `https://geegees-salon.onrender.com`
   - First 4 services should appear in the "Curated Services" section

2. **Services Page**: Visit `https://geegees-salon.onrender.com/services`
   - All services should be displayed, grouped by category

## How It Works

**Admin Flow:**
- Admin adds/edits/deletes services at `/admin/services`
- Changes are saved directly to Supabase database
- Updates appear instantly on the website (no code deployment needed)

**User Flow:**
- Homepage displays first 4 services dynamically
- Services page displays all services grouped by category
- All data fetched from Supabase in real-time

## Troubleshooting

**Services not showing?**
- Check that all 3 environment variables are set in Render
- Verify Render deployment completed successfully (green "Live" status)
- Check browser console for errors (F12 → Console tab)
- Ensure services were added via admin panel

**Database connection error?**
- Verify `DATABASE_URL` has `%40%2E%2E` (not `@..`)
- Check Supabase project is active
- Confirm credentials haven't expired

**Still having issues?**
- Check Render logs: Dashboard → Your Service → "Logs" tab
- Verify Supabase tables exist: Supabase Dashboard → Table Editor
- Make sure the `services` table has data

## Admin Access

**Admin Panel Homepage:** `https://geegees-salon.onrender.com/admin`

From there you can access:
- **Services Management:** `/admin/services` - Add, edit, delete services
- **Dashboard:** `/admin/dashboard` - Overview and analytics
- **Team Management:** `/admin/team` - Manage staff profiles
- **Appointments:** `/admin/appointments` - View bookings
- **Content Management:** `/admin/content` - Update website content
- **Inquiries:** `/admin/inquiries` - View customer messages

**Note:** Currently **NO authentication required** - Anyone can access the admin panel. Add proper authentication before making the site public!
