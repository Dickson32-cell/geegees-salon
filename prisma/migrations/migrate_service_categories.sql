-- ============================================
-- Service Category Migration Script
-- ============================================
-- This script recategorizes existing services to match the new category structure
-- Run this in Supabase SQL Editor after reviewing the changes
--
-- New Category Structure:
-- - Hair: Haircuts only (Men's Cut, Women's Cut, Kids Cut, Trim)
-- - Styling: Bridal Hair, Event Styling, Updos, Blowouts
-- - Treatments: Hair Coloring, Highlights, Keratin, Deep Conditioning
-- - Spa: Massages, Facials, Body Treatments
-- - Makeup: Bridal Makeup, Event Makeup, Everyday Makeup
-- - Skincare: Facials, Treatments, Waxing
-- - Nails: Manicure, Pedicure, Nail Art, Acrylic/Gel
-- - Braids: Box Braids, Cornrows, Twists, Weaves
-- ============================================

-- PREVIEW CHANGES FIRST (run this to see what will change)
SELECT
    id,
    name,
    category AS old_category,
    subcategory AS old_subcategory,
    CASE
        -- STYLING SERVICES (Bridal, Events, Updos, Blowouts)
        WHEN LOWER(name) LIKE '%bridal hair%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%wedding hair%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%event styling%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%special occasion%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%updo%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%up do%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%blowout%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%blow dry%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%blow-dry%' THEN 'Styling'
        WHEN LOWER(name) LIKE '%styling%' AND category = 'Hair' THEN 'Styling'

        -- TREATMENTS (Coloring, Chemical Services, Conditioning)
        WHEN LOWER(name) LIKE '%color%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%highlight%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%lowlight%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%balayage%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%ombre%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%keratin%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%relaxer%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%perm%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%deep condition%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%treatment%' AND category = 'Hair' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%bleach%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%dye%' THEN 'Treatments'
        WHEN LOWER(name) LIKE '%tint%' THEN 'Treatments'

        -- HAIR CUTS (Keep as Hair)
        WHEN LOWER(name) LIKE '%haircut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%hair cut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%men%s cut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%women%s cut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%kids cut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%child%cut%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%trim%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%bang trim%' THEN 'Hair'
        WHEN LOWER(name) LIKE '%fringe%' THEN 'Hair'

        -- Keep other categories unchanged
        ELSE category
    END AS new_category,
    CASE
        -- STYLING SUBCATEGORIES
        WHEN LOWER(name) LIKE '%bridal%' THEN 'Bridal Hair'
        WHEN LOWER(name) LIKE '%wedding%' THEN 'Bridal Hair'
        WHEN LOWER(name) LIKE '%event%' THEN 'Event Styling'
        WHEN LOWER(name) LIKE '%special occasion%' THEN 'Event Styling'
        WHEN LOWER(name) LIKE '%updo%' OR LOWER(name) LIKE '%up do%' THEN 'Updos'
        WHEN LOWER(name) LIKE '%blowout%' OR LOWER(name) LIKE '%blow dry%' OR LOWER(name) LIKE '%blow-dry%' THEN 'Blowouts'

        -- TREATMENTS SUBCATEGORIES
        WHEN LOWER(name) LIKE '%color%' OR LOWER(name) LIKE '%dye%' THEN 'Hair Coloring'
        WHEN LOWER(name) LIKE '%highlight%' OR LOWER(name) LIKE '%lowlight%' OR LOWER(name) LIKE '%balayage%' THEN 'Highlights'
        WHEN LOWER(name) LIKE '%keratin%' THEN 'Keratin'
        WHEN LOWER(name) LIKE '%deep condition%' OR LOWER(name) LIKE '%treatment%' THEN 'Deep Conditioning'

        -- HAIR CUT SUBCATEGORIES
        WHEN LOWER(name) LIKE '%men%' AND (LOWER(name) LIKE '%cut%' OR LOWER(name) LIKE '%trim%') THEN 'Men''s Cut'
        WHEN LOWER(name) LIKE '%women%' AND (LOWER(name) LIKE '%cut%' OR LOWER(name) LIKE '%trim%') THEN 'Women''s Cut'
        WHEN LOWER(name) LIKE '%kid%' OR LOWER(name) LIKE '%child%' THEN 'Kids Cut'
        WHEN LOWER(name) LIKE '%trim%' OR LOWER(name) LIKE '%bang%' THEN 'Trim'

        -- Keep existing subcategory if no match
        ELSE subcategory
    END AS new_subcategory
FROM services
WHERE category IN ('Hair', 'Spa', 'Makeup', 'Skincare', 'Nails', 'Braids')
ORDER BY category, name;

-- ============================================
-- AFTER REVIEWING THE PREVIEW ABOVE,
-- UNCOMMENT AND RUN THE FOLLOWING UPDATE STATEMENT
-- ============================================

/*
-- UPDATE STYLING SERVICES
UPDATE services
SET
    category = 'Styling',
    subcategory = CASE
        WHEN LOWER(name) LIKE '%bridal%' OR LOWER(name) LIKE '%wedding%' THEN 'Bridal Hair'
        WHEN LOWER(name) LIKE '%event%' OR LOWER(name) LIKE '%special occasion%' THEN 'Event Styling'
        WHEN LOWER(name) LIKE '%updo%' OR LOWER(name) LIKE '%up do%' THEN 'Updos'
        WHEN LOWER(name) LIKE '%blowout%' OR LOWER(name) LIKE '%blow dry%' OR LOWER(name) LIKE '%blow-dry%' THEN 'Blowouts'
        ELSE 'Event Styling'
    END
WHERE LOWER(name) LIKE '%bridal hair%'
   OR LOWER(name) LIKE '%wedding hair%'
   OR LOWER(name) LIKE '%event styling%'
   OR LOWER(name) LIKE '%special occasion%'
   OR LOWER(name) LIKE '%updo%'
   OR LOWER(name) LIKE '%up do%'
   OR LOWER(name) LIKE '%blowout%'
   OR LOWER(name) LIKE '%blow dry%'
   OR LOWER(name) LIKE '%blow-dry%'
   OR (LOWER(name) LIKE '%styling%' AND category = 'Hair');

-- UPDATE TREATMENTS SERVICES
UPDATE services
SET
    category = 'Treatments',
    subcategory = CASE
        WHEN LOWER(name) LIKE '%color%' OR LOWER(name) LIKE '%dye%' THEN 'Hair Coloring'
        WHEN LOWER(name) LIKE '%highlight%' OR LOWER(name) LIKE '%lowlight%' OR LOWER(name) LIKE '%balayage%' THEN 'Highlights'
        WHEN LOWER(name) LIKE '%keratin%' THEN 'Keratin'
        WHEN LOWER(name) LIKE '%deep condition%' OR LOWER(name) LIKE '%treatment%' THEN 'Deep Conditioning'
        ELSE 'Hair Coloring'
    END
WHERE LOWER(name) LIKE '%color%'
   OR LOWER(name) LIKE '%highlight%'
   OR LOWER(name) LIKE '%lowlight%'
   OR LOWER(name) LIKE '%balayage%'
   OR LOWER(name) LIKE '%ombre%'
   OR LOWER(name) LIKE '%keratin%'
   OR LOWER(name) LIKE '%relaxer%'
   OR LOWER(name) LIKE '%perm%'
   OR LOWER(name) LIKE '%deep condition%'
   OR LOWER(name) LIKE '%bleach%'
   OR LOWER(name) LIKE '%dye%'
   OR LOWER(name) LIKE '%tint%'
   OR (LOWER(name) LIKE '%treatment%' AND category = 'Hair');

-- UPDATE HAIR CUT SUBCATEGORIES
UPDATE services
SET
    subcategory = CASE
        WHEN LOWER(name) LIKE '%men%' THEN 'Men''s Cut'
        WHEN LOWER(name) LIKE '%women%' OR LOWER(name) LIKE '%ladies%' THEN 'Women''s Cut'
        WHEN LOWER(name) LIKE '%kid%' OR LOWER(name) LIKE '%child%' THEN 'Kids Cut'
        WHEN LOWER(name) LIKE '%trim%' OR LOWER(name) LIKE '%bang%' THEN 'Trim'
        ELSE 'Women''s Cut'
    END
WHERE category = 'Hair'
  AND (LOWER(name) LIKE '%cut%' OR LOWER(name) LIKE '%trim%');
*/

-- ============================================
-- VERIFICATION QUERY (Run after updates)
-- ============================================
/*
SELECT
    category,
    subcategory,
    COUNT(*) as service_count,
    STRING_AGG(name, ', ') as services
FROM services
GROUP BY category, subcategory
ORDER BY category, subcategory;
*/
