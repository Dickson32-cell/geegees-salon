# Service Category Migration Instructions

## Overview
This migration recategorizes existing services to match the new professional grouping structure:

- **Hair** → Haircuts only (Men's Cut, Women's Cut, Kids Cut, Trim)
- **Styling** → Bridal Hair, Event Styling, Updos, Blowouts *(NEW)*
- **Treatments** → Hair Coloring, Highlights, Keratin, Deep Conditioning *(NEW)*
- Other categories remain unchanged

## Problem Being Solved
Currently, "Bridal Hair Design" and similar services are incorrectly grouped under "Hair" (haircuts). This migration moves them to the correct categories.

## Steps to Run Migration

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your GeeGees Salon project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Preview Changes (IMPORTANT - Do This First!)
1. Copy the **PREVIEW query** from `migrate_service_categories.sql` (lines 24-96)
2. Paste it into the SQL Editor
3. Click **Run** to see what changes will be made
4. Review the output:
   - `old_category` → What the service is currently categorized as
   - `new_category` → What it will be changed to
   - `old_subcategory` → Current subcategory
   - `new_subcategory` → New subcategory

### Step 3: Run the Migration
**Only after reviewing the preview and confirming it looks correct:**

1. Copy the **UPDATE statements** from `migrate_service_categories.sql` (lines 103-175)
   - These are the lines between `/* */` comment blocks
2. Remove the `/*` at the beginning and `*/` at the end to uncomment them
3. Paste into SQL Editor
4. Click **Run**
5. You should see messages like:
   ```
   UPDATE 5  -- Number of services updated
   UPDATE 3
   UPDATE 8
   ```

### Step 4: Verify the Changes
1. Copy the **VERIFICATION query** from the bottom of the file (lines 177-187)
2. Remove the `/*` and `*/` to uncomment it
3. Run it to see the new service groupings
4. Check that services are now properly categorized

### Step 5: Check Your Website
1. Go to your admin panel: https://your-site.com/admin/services
2. Verify services show correct categories
3. Go to public services page: https://your-site.com/services
4. Confirm services are properly grouped

## What Gets Updated

### Moved to "Styling" Category:
- Services with "bridal hair", "wedding hair"
- Services with "event styling", "special occasion"
- Services with "updo", "blowout", "blow dry"

### Moved to "Treatments" Category:
- Services with "color", "highlight", "balayage"
- Services with "keratin", "relaxer", "perm"
- Services with "deep condition", "treatment"

### Stays in "Hair" Category:
- Services with "haircut", "hair cut"
- Services with "men's cut", "women's cut", "kids cut"
- Services with "trim", "bang trim"

## Rollback (If Something Goes Wrong)

If you need to undo the changes:

```sql
-- This only works if you haven't deleted the old data
-- Contact support if you need help rolling back
```

## Need Help?
If you see unexpected results or need assistance:
1. Take a screenshot of the preview query results
2. Don't run the UPDATE statements
3. Contact support with the screenshot

## After Migration
- All new services created through the admin panel will use the correct categories automatically
- You can manually adjust any service categories in the admin panel if needed
- The migration only needs to be run once
