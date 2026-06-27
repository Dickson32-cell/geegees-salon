# How to Get Your Complete Render Database URL

## Steps:

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click on your PostgreSQL database** (NOT the web service!)
   - Look for the database icon
   - It should be named something like "geegees_salon" or "geegees-db"

3. **Scroll down to the "Connections" section**

4. **Look for "Internal Database URL"**
   - It should look like ONE of these formats:

   ```
   postgresql://geegees_salon_user:BrZaI0QX8Dml94XNt0gGchxVRakAxt2v@dpg-d8vfhjtaeets73d0630g-a.oregon-postgres.render.com:5432/geegees_salon
   ```

   OR

   ```
   postgresql://geegees_salon_user:BrZaI0QX8Dml94XNt0gGchxVRakAxt2v@dpg-d8vfhjtaeets73d0630g-a.frankfurt-postgres.render.com:5432/geegees_salon
   ```

   OR

   ```
   postgresql://geegees_salon_user:BrZaI0QX8Dml94XNt0gGchxVRakAxt2v@dpg-d8vfhjtaeets73d0630g-a.singapore-postgres.render.com:5432/geegees_salon
   ```

   **Key point**: The hostname should include a region like `.oregon-postgres.render.com` or similar!

5. **Copy the ENTIRE URL** (all one line)

6. **Share it with me** so I can update your .env file

---

## Alternative: Check Database Status

If you can't find the URL:

1. Go to your database in Render dashboard
2. Check if the status is **"Available"** (green dot)
3. If it says "Creating" or "Suspended", wait for it to become available
4. Screenshot the connections section and share it

---

## What I Need From You:

Please copy and paste the **complete Internal Database URL** from your Render PostgreSQL dashboard.

It should be ONE LONG LINE starting with `postgresql://` and ending with `/geegees_salon`
