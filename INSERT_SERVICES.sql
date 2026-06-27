-- GeeGees Unisex Salon Services
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- PEDICURE SERVICES
INSERT INTO services (name, category, price, duration, description) VALUES
('Classic Pedicure', 'Pedicure', 'GH₵ 150', '45 mins', 'Classic pedicure treatment for healthy, beautiful feet'),
('Jelly Pedicure', 'Pedicure', 'GH₵ 200', '60 mins', 'Luxurious jelly pedicure with moisturizing benefits'),
('Milky Pedicure', 'Pedicure', 'GH₵ 250', '60 mins', 'Nourishing milky pedicure for soft, smooth skin'),
('Fruity Pedicure', 'Pedicure', 'GH₵ 300', '75 mins', 'Refreshing fruity pedicure with vitamin-rich treatment');

-- NAIL SERVICES
INSERT INTO services (name, category, price, duration, description) VALUES
('Gel Polish (Short)', 'Nails', 'GH₵ 80', '45 mins', 'Professional gel polish application for short nails'),
('Gel Polish (Medium)', 'Nails', 'GH₵ 100', '60 mins', 'Professional gel polish application for medium nails'),
('Gel Polish (Long)', 'Nails', 'GH₵ 120', '75 mins', 'Professional gel polish application for long nails'),
('Poly Gel (Short)', 'Nails', 'GH₵ 120', '60 mins', 'Durable poly gel nail enhancement - short length'),
('Poly Gel (Long)', 'Nails', 'GH₵ 180', '90 mins', 'Durable poly gel nail enhancement - long length'),
('Acrylic Nails (Short)', 'Nails', 'GH₵ 150', '75 mins', 'Classic acrylic nail application - short length'),
('Acrylic Nails (Medium)', 'Nails', 'GH₵ 180', '90 mins', 'Classic acrylic nail application - medium length'),
('Acrylic Nails (Long)', 'Nails', 'GH₵ 250', '120 mins', 'Classic acrylic nail application - long length'),
('Nail Overlay', 'Nails', 'GH₵ 120', '60 mins', 'Protective overlay for natural nails'),
('Acrylic Refill', 'Nails', 'GH₵ 50', '45 mins', 'Acrylic nail refill and maintenance'),
('Toe Nails (Regular)', 'Nails', 'GH₵ 60', '45 mins', 'Professional toe nail service - regular'),
('Toe Nails (Premium)', 'Nails', 'GH₵ 80', '60 mins', 'Premium toe nail service with design'),
('Nail Polishing', 'Nails', 'GH₵ 35', '30 mins', 'Simple nail polishing service'),
('Nail Trimming', 'Nails', 'GH₵ 20', '15 mins', 'Basic nail trimming and shaping');

-- LASH SERVICES - CLUSTER
INSERT INTO services (name, category, price, duration, description) VALUES
('Full Signature Cluster Lashes', 'Lashes', 'GH₵ 80', '45 mins', 'Full set of signature cluster lash extensions');

-- LASH SERVICES - CLASSIC
INSERT INTO services (name, category, price, duration, description) VALUES
('Regular Classic Lashes', 'Lashes', 'GH₵ 120', '90 mins', 'Regular classic lash extension set'),
('Cat Eye Classic Lashes', 'Lashes', 'GH₵ 140', '105 mins', 'Cat eye style classic lash extensions');

-- LASH SERVICES - HYBRID
INSERT INTO services (name, category, price, duration, description) VALUES
('Regular Hybrid Lashes', 'Lashes', 'GH₵ 170', '120 mins', 'Regular hybrid lash extension set'),
('Cat Eye Hybrid Lashes', 'Lashes', 'GH₵ 190', '135 mins', 'Cat eye style hybrid lash extensions'),
('Cat Eye Wispy Hybrid Lashes', 'Lashes', 'GH₵ 200', '150 mins', 'Cat eye wispy hybrid lash extensions');

-- LASH SERVICES - VOLUME
INSERT INTO services (name, category, price, duration, description) VALUES
('Regular Volume Lashes', 'Lashes', 'GH₵ 210', '150 mins', 'Regular volume lash extension set'),
('Cat Eye Volume Lashes', 'Lashes', 'GH₵ 230', '165 mins', 'Cat eye style volume lash extensions'),
('Cat Eye Wispy Premium Volume', 'Lashes', 'GH₵ 250', '180 mins', 'Premium cat eye wispy volume lash extensions');

-- HAIR SERVICES - HAIRCUTS
INSERT INTO services (name, category, price, duration, description) VALUES
('Normal Haircut', 'Hair Services', 'GH₵ 70', '45 mins', 'Professional haircut for men and ladies'),
('Haircut with Black Dye', 'Hair Services', 'GH₵ 100', '75 mins', 'Haircut with black dye application'),
('Waves Haircut', 'Hair Services', 'GH₵ 150', '90 mins', 'Haircut with wave styling');

-- HAIR SERVICES - COLORING
INSERT INTO services (name, category, price, duration, description) VALUES
('Gold Hair Color', 'Hair Coloring', 'GH₵ 80', '60 mins', 'Vibrant gold hair coloring'),
('Vibrant Hair Color', 'Hair Coloring', 'GH₵ 100', '75 mins', 'Other vibrant hair color options');

-- KIDS HAIRCUTS
INSERT INTO services (name, category, price, duration, description) VALUES
('Kids Normal Haircut', 'Kids Hair', 'GH₵ 30', '30 mins', 'Regular haircut for children'),
('Kids Haircut with Black Dye', 'Kids Hair', 'GH₵ 60', '45 mins', 'Kids haircut with black dye'),
('Kids Haircut with Curls', 'Kids Hair', 'GH₵ 90', '60 mins', 'Kids haircut with curl styling');

-- PIXIE STYLE & ARTISTRY
INSERT INTO services (name, category, price, duration, description) VALUES
('Tonging Mastercraft', 'Hair Styling', 'GH₵ 180', '90 mins', 'Expert tonging mastercraft for ladies'),
('Finger Waves', 'Hair Styling', 'GH₵ 180', '90 mins', 'Classic finger wave styling'),
('Smooth Premium Pixie', 'Hair Styling', 'GH₵ 150', '75 mins', 'Smooth premium pixie styling');

-- BRAIDING BASICS
INSERT INTO services (name, category, price, duration, description) VALUES
('Hair Washing (Permed)', 'Braiding', 'GH₵ 40-50', '30 mins', 'Professional washing for permed hair'),
('Hair Washing (Natural)', 'Braiding', 'GH₵ 40-50', '30 mins', 'Professional washing for natural hair'),
('Steaming Treatment', 'Braiding', 'GH₵ 100', '45 mins', 'Deep conditioning steaming treatment'),
('Retouching', 'Braiding', 'GH₵ 60', '60 mins', 'Hair retouching service');

-- BRAIDS & STYLING
INSERT INTO services (name, category, price, duration, description) VALUES
('Normal Cornrows', 'Braiding', 'GH₵ 40-50', '90 mins', 'Classic cornrow braiding'),
('Natural Twist', 'Braiding', 'GH₵ 50-100', '120 mins', 'Natural twist braiding style'),
('Knotless Braids', 'Braiding', 'GH₵ 160-360', '180-300 mins', 'Premium knotless braids - pain-free'),
('Cornrow Pony/Rasta', 'Braiding', 'GH₵ 160-350', '150-240 mins', 'Cornrow ponytail or rasta style'),
('Premium Curl Braids', 'Braiding', 'GH₵ 230-300', '180-240 mins', 'Premium curl braid styling');

-- LOCS & SPECIALIZED
INSERT INTO services (name, category, price, duration, description) VALUES
('Permanent Locs', 'Locs', 'GH₵ 500-1,500', '4-8 hours', 'Professional permanent loc installation'),
('Faux/Butterfly Locs', 'Locs', 'GH₵ 160-400', '3-5 hours', 'Beautiful faux or butterfly loc style'),
('Relocking Maintenance', 'Locs', 'GH₵ 160-350', '2-4 hours', 'Professional loc maintenance and relocking'),
('Mini/Kinky Twist', 'Locs', 'GH₵ 160-500', '3-6 hours', 'Mini or kinky twist styling'),
('Sew-in Weave', 'Locs', 'GH₵ 220', '3 hours', 'Professional sew-in weave installation');

-- FACIAL SERVICES
INSERT INTO services (name, category, price, duration, description) VALUES
('Classic Facial Treatment', 'Facials', 'GH₵ 250', '60 mins', 'Classic facial treatment for glowing skin'),
('Deep Cleansing Facial', 'Facials', 'GH₵ 300', '75 mins', 'Deep cleansing facial for problem skin');

-- TEETH WHITENING
INSERT INTO services (name, category, price, duration, description) VALUES
('2 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 200', '60 mins', 'Professional teeth whitening - 2 sessions'),
('3 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 300', '90 mins', 'Professional teeth whitening - 3 sessions'),
('4 Teeth Whitening Sessions', 'Teeth Whitening', 'GH₵ 400', '120 mins', 'Professional teeth whitening - 4 sessions');

-- BRACES
INSERT INTO services (name, category, price, duration, description) VALUES
('O-Ring Braces Placement', 'Braces', 'GH₵ 450', '90 mins', 'Premium fashion braces with O-ring placement'),
('Power Chain Braces Alignment', 'Braces', 'GH₵ 380', '75 mins', 'Fashion braces with power chain alignment');
