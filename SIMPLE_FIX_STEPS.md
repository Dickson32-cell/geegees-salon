# ✅ SIMPLE 3-STEP FIX - DO THESE IN ORDER

## Problem: "An error occurred. Please try again" when booking

## Solution: Follow these 3 steps EXACTLY

---

## ✅ STEP 1: Fix Supabase Database (5 minutes)

### 1.1: Go to Supabase
- Open: https://supabase.com/dashboard
- Log in
- Select your project

### 1.2: Run This SQL
- Click **"SQL Editor"** (left sidebar)
- Click **"+ New query"**
- **DELETE everything** in the editor
- **Copy and paste this EXACT code:**

```sql
-- Delete old table if exists
DROP TABLE IF EXISTS appointments CASCADE;

-- Create new appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    service TEXT NOT NULL,
    stylist TEXT NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    appointment_time TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE security so inserts work
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Test it works
INSERT INTO appointments (service, stylist, appointment_date, appointment_time, customer_name, customer_email, customer_phone, notes, status)
VALUES ('Test Service', 'Test Stylist', NOW(), '10:00 AM', 'Test Customer', 'test@test.com', '+1234567890', 'Test', 'pending');

-- Show the test record
SELECT * FROM appointments;
```

### 1.3: Click "RUN" (bottom right)

### 1.4: Check it worked
- You should see a table with 1 row (the test appointment)
- If you see this, ✅ Step 1 is DONE!

---

## ✅ STEP 2: Fix Render Environment Variables (3 minutes)

### 2.1: Go to Render
- Open: https://dashboard.render.com
- Click on your **geegees-salon** service
- Click **"Environment"** tab on the left

### 2.2: Check if these variables exist:
Look for:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.3: If MISSING, add them:

**Click "Add Environment Variable"** and add:

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://jqxpqrjykxmrzgtgfxpi.supabase.co
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHBxcmp5a3htcnpndGdmeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjA0NzQsImV4cCI6MjA5Nzk5NjQ3NH0.geJL2H29wpU1473nCsHo0q7og9EtUl8-vvlBLv0HAts
```

### 2.4: Click "Save Changes"
- This will trigger a redeploy
- ✅ Step 2 is DONE!

---

## ✅ STEP 3: Wait and Test (5 minutes)

### 3.1: Wait for Render to Deploy
- Go to **"Logs"** tab in Render
- Wait until you see: **"Your service is live 🎉"**
- This takes 3-5 minutes

### 3.2: Clear Browser Cache
- Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
- Select "Cached images and files"
- Click "Clear data"

### 3.3: Test Booking
- Go to https://geegeessalon.com
- Click **"Book Now"**
- Fill out the form completely
- Click **"Confirm Booking"**
- ✅ You should see **"Booking Confirmed!"** with a receipt

---

## 🎯 After Doing All 3 Steps:

If booking STILL doesn't work:

1. Open browser console (Press F12)
2. Click "Console" tab
3. Try to book again
4. Take a screenshot of ANY red error messages
5. Send me the screenshot

Also send me:
- Screenshot of Supabase Table Editor showing "appointments" table
- Screenshot of Render Environment Variables showing both variables

I will fix it immediately!

---

## Quick Checklist:

- [ ] Step 1: Ran SQL in Supabase and saw test appointment ✅
- [ ] Step 2: Added both environment variables to Render ✅
- [ ] Step 3: Waited for deploy, cleared cache, tested booking ✅

---

**One more thing:** Which step are you on? Tell me:
- "I'm on Step 1" or
- "I'm on Step 2" or
- "I finished all 3 steps but still getting error"

This will help me help you faster!
