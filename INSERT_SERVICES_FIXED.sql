-- GeeGees Unisex Salon Services - FIXED VERSION
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- PEDICURE SERVICES
INSERT INTO services (name, category, price, duration, description, created_at, updated_at) VALUES
('Classic Pedicure', 'Pedicure', 'GH₵ 150', '45 mins', 'Classic pedicure treatment for healthy, beautiful feet', NOW(), NOW()),
('Jelly Pedicure', 'Pedicure', 'GH₵ 200', '60 mins', 'Luxurious jelly pedicure with moisturizing benefits', NOW(), NOW()),
('Milky Pedicure', 'Pedicure', 'GH₵ 250', '60 mins', 'Nourishing milky pedicure for soft, smooth skin', NOW(), NOW()),
('Fruity Pedicure', 'Pedicure', 'GH₵ 300', '75 mins', 'Refreshing fruity pedicure with vitamin-rich treatment', NOW(), NOW()),

-- NAIL SERVICES
('Gel Polish (Short)', 'Nails', 'GH₵ 80', '45 mins', 'Professional gel polish application for short nails', NOW(), NOW()),
('Gel Polish (Medium)', 'Nails', 'GH₵ 100', '60 mins', 'Professional gel polish application for medium nails', NOW(), NOW()),
('Gel Polish (Long)', 'Nails', 'GH₵ 120', '75 mins', 'Professional gel polish application for long nails', NOW(), NOW()),
('Poly Gel (Short)', 'Nails', 'GH₵ 120', '60 mins', 'Durable poly gel nail enhancement', NOW(), NOW()),
('Poly Gel (Long)', 'Nails', 'GH₵ 180', '90 mins', 'Durable poly gel nail enhancement - long length', NOW(), NOW()),
('Acrylic Nails (Short)', 'Nails', 'GH₵ 150', '75 mins', 'Classic acrylic nail application', NOW(), NOW()),
('Acrylic Nails (Medium)', 'Nails', 'GH₵ 180', '90 mins', 'Classic acrylic nail application - medium', NOW(), NOW()),
('Acrylic Nails (Long)', 'Nails', 'GH₵ 250', '120 mins', 'Classic acrylic nail application - long', NOW(), NOW()),
('Nail Overlay', 'Nails', 'GH₵ 120', '60 mins', 'Protective overlay for natural nails', NOW(), NOW()),
('Acrylic Refill', 'Nails', 'GH₵ 50', '45 mins', 'Acrylic nail refill and maintenance', NOW(), NOW()),
('Toe Nails (Regular)', 'Nails', 'GH₵ 60', '45 mins', 'Professional toe nail service', NOW(), NOW()),
('Toe Nails (Premium)', 'Nails', 'GH₵ 80', '60 mins', 'Premium toe nail service with design', NOW(), NOW()),
('Nail Polishing', 'Nails', 'GH₵ 35', '30 mins', 'Simple nail polishing service', NOW(), NOW()),
('Nail Trimming', 'Nails', 'GH₵ 20', '15 mins', 'Basic nail trimming and shaping', NOW(), NOW()),

-- LASH SERVICES
('Full Signature Cluster Lashes', 'Lashes', 'GH₵ 80', '45 mins', 'Full set of signature cluster lash extensions', NOW(), NOW()),
('Regular Classic Lashes', 'Lashes', 'GH₵ 120', '90 mins', 'Regular classic lash extension set', NOW(), NOW()),
('Cat Eye Classic Lashes', 'Lashes', 'GH₵ 140', '105 mins', 'Cat eye style classic lash extensions', NOW(), NOW()),
('Regular Hybrid Lashes', 'Lashes', 'GH₵ 170', '120 mins', 'Regular hybrid lash extension set', NOW(), NOW()),
('Cat Eye Hybrid Lashes', 'Lashes', 'GH₵ 190', '135 mins', 'Cat eye style hybrid lash extensions', NOW(), NOW()),
('Cat Eye Wispy Hybrid Lashes', 'Lashes', 'GH₵ 200', '150 mins', 'Cat eye wispy hybrid lash extensions', NOW(), NOW()),
('Regular Volume Lashes', 'Lashes', 'GH₵ 210', '150 mins', 'Regular volume lash extension set', NOW(), NOW()),
('Cat Eye Volume Lashes', 'Lashes', 'GH₵ 230', '165 mins', 'Cat eye style volume lash extensions', NOW(), NOW()),
('Cat Eye Wispy Premium Volume', 'Lashes', 'GH₵ 250', '180 mins', 'Premium cat eye wispy volume lashes', NOW(), NOW()),

-- HAIR SERVICES
('Normal Haircut', 'Hair Services', 'GH₵ 70', '45 mins', 'Professional haircut for men and ladies', NOW(), NOW()),
('Haircut with Black Dye', 'Hair Services', 'GH₵ 100', '75 mins', 'Haircut with black dye application', NOW(), NOW()),
('Waves Haircut', 'Hair Services', 'GH₵ 150', '90 mins', 'Haircut with wave styling', NOW(), NOW()),
('Gold Hair Color', 'Hair Coloring', 'GH₵ 80', '60 mins', 'Vibrant gold hair coloring', NOW(), NOW()),
('Vibrant Hair Color', 'Hair Coloring', 'GH₵ 100', '75 mins', 'Other vibrant hair color options', NOW(), NOW()),

-- KIDS HAIR
('Kids Normal Haircut', 'Kids Hair', 'GH₵ 30', '30 mins', 'Regular haircut for children', NOW(), NOW()),
('Kids Haircut with Black Dye', 'Kids Hair', 'GH₵ 60', '45 mins', 'Kids haircut with black dye', NOW(), NOW()),
('Kids Haircut with Curls', 'Kids Hair', 'GH₵ 90', '60 mins', 'Kids haircut with curl styling', NOW(), NOW()),

-- HAIR STYLING
('Tonging Mastercraft', 'Hair Styling', 'GH₵ 180', '90 mins', 'Expert tonging mastercraft for ladies', NOW(), NOW()),
('Finger Waves', 'Hair Styling', 'GH₵ 180', '90 mins', 'Classic finger wave styling', NOW(), NOW()),
('Smooth Premium Pixie', 'Hair Styling', 'GH₵ 150', '75 mins', 'Smooth premium pixie styling', NOW(), NOW()),

-- BRAIDING
('Hair Washing (Permed)', 'Braiding', 'GH₵ 40-50', '30 mins', 'Professional washing for permed hair', NOW(), NOW()),
('Hair Washing (Natural)', 'Braiding', 'GH₵ 40-50', '30 mins', 'Professional washing for natural hair', NOW(), NOW()),
('Steaming Treatment', 'Braiding', 'GH₵ 100', '45 mins', 'Deep conditioning steaming treatment', NOW(), NOW()),
('Retouching', 'Braiding', 'GH₵ 60', '60 mins', 'Hair retouching service', NOW(), NOW()),
('Normal Cornrows', 'Braiding', 'GH₵ 40-50', '90 mins', 'Classic cornrow braiding', NOW(), NOW()),
('Natural Twist', 'Braiding', 'GH₵ 50-100', '120 mins', 'Natural twist braiding style', NOW(), NOW()),
('Knotless Braids', 'Braiding', 'GH₵ 160-360', '3-5 hours', 'Premium knotless braids - pain-free', NOW(), NOW()),
('Cornrow Pony/Rasta', 'Braiding', 'GH₵ 160-350', '3-4 hours', 'Cornrow ponytail or rasta style', NOW(), NOW()),
('Premium Curl Braids', 'Braiding', 'GH₵ 230-300', '3-4 hours', 'Premium curl braid styling', NOW(), NOW()),

-- LOCS
('Permanent Locs', 'Locs', 'GH₵ 500-1,500', '4-8 hours', 'Professional permanent loc installation', NOW(), NOW()),
('Faux/Butterfly Locs', 'Locs', 'GH₵ 160-400', '3-5 hours', 'Beautiful faux or butterfly loc style', NOW(), NOW()),
('Relocking Maintenance', 'Locs', 'GH₵ 160-350', '2-4 hours', 'Professional loc maintenance', NOW(), NOW()),
('Mini/Kinky Twist', 'Locs', 'GH₵ 160-500', '3-6 hours', 'Mini or kinky twist styling', NOW(), NOW()),
('Sew-in Weave', 'Locs', 'GH₵ 220', '3 hours', 'Professional sew-in weave installation', NOW(), NOW()),

-- FACIALS
('Classic Facial Treatment', 'Facials', 'GH₵ 250', '60 mins', 'Classic facial treatment for glowing skin', NOW(), NOW()),
('Deep Cleansing Facial', 'Facials', 'GH₵ 300', '75 mins', 'Deep cleansing facial for problem skin', NOW(), NOW()),

-- TEETH WHITENING
('2 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 200', '60 mins', 'Professional teeth whitening - 2 sessions', NOW(), NOW()),
('3 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 300', '90 mins', 'Professional teeth whitening - 3 sessions', NOW(), NOW()),
('4 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 400', '120 mins', 'Professional teeth whitening - 4 sessions', NOW(), NOW()),

-- BRACES
('O-Ring Braces Placement', 'Braces', 'GH₵ 450', '90 mins', 'Premium fashion braces with O-ring placement', NOW(), NOW()),
('Power Chain Braces Alignment', 'Braces', 'GH₵ 380', '75 mins', 'Fashion braces with power chain alignment', NOW(), NOW());
