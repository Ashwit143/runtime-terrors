-- ==============================================================================
-- Waste 2 Worth: Supabase PostgreSQL Schema & Seed Migration
-- Industrial Waste-Exchange Matching Platform
-- ==============================================================================

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  is_hazmat_licensed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Listings Table
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(64) PRIMARY KEY,
  company_name TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('SUPPLIER', 'RECEIVER')),
  category VARCHAR(50) NOT NULL,
  material_name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC NOT NULL,
  unit VARCHAR(30) NOT NULL DEFAULT 'tonnes/month',
  quality_grade VARCHAR(20) NOT NULL CHECK (quality_grade IN ('LOW', 'MEDIUM', 'HIGH')),
  frequency VARCHAR(30) NOT NULL CHECK (frequency IN ('CONTINUOUS', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ONE_TIME')),
  city TEXT NOT NULL,
  state TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  is_hazardous BOOLEAN DEFAULT FALSE,
  is_hazmat_licensed BOOLEAN DEFAULT FALSE,
  price_per_unit NUMERIC,
  currency VARCHAR(10) DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_quality_grade ON listings(quality_grade);
CREATE INDEX IF NOT EXISTS idx_listings_is_hazardous ON listings(is_hazardous);
CREATE INDEX IF NOT EXISTS idx_listings_is_hazmat_licensed ON listings(is_hazmat_licensed);

-- 4. Seed Initial Indian Industrial Enterprises
INSERT INTO listings (
  id, company_name, type, category, material_name, description,
  quantity, unit, quality_grade, frequency, city, state,
  contact_person, email, phone, is_hazardous, is_hazmat_licensed, price_per_unit, currency
) VALUES
  ('supp_001', 'Aravalli Polymers Pvt. Ltd.', 'SUPPLIER', 'PLASTIC', 'PET Bottle Flakes (Washed)', 'Pre-sorted hot-washed clear PET bottle flakes, <100ppm moisture, 10mm particle size.', 120, 'tonnes/month', 'HIGH', 'CONTINUOUS', 'Surat', 'Gujarat', 'Rajesh Patel', 'rajesh@aravallipolymers.in', '+91 98250 11223', false, false, 42000, 'INR'),
  ('supp_002', 'Surya Textile Mills', 'SUPPLIER', 'TEXTILE', '100% Combed Cotton Yarn Waste', 'Clean combed cotton sliver and ring spun yarn waste, unbleached, high tensile fiber.', 85, 'tonnes/month', 'HIGH', 'WEEKLY', 'Coimbatore', 'Tamil Nadu', 'K. Sundaram', 'sundaram@suryatextiles.com', '+91 94431 88776', false, false, 28000, 'INR'),
  ('supp_003', 'Western Metal Recovery Ltd.', 'SUPPLIER', 'METAL', 'Aluminium 6063 Scrap (Extrusion)', 'Clean architectural profile offcuts and punchings, 98.5% Al purity, oil-free.', 45, 'tonnes/month', 'HIGH', 'MONTHLY', 'Pune', 'Maharashtra', 'Amit Deshmukh', 'amit@westernmetal.co.in', '+91 98220 44556', false, false, 185000, 'INR'),
  ('supp_004', 'Narmada Agro Bio-Products', 'SUPPLIER', 'FOOD_AGRO', 'De-oiled Rice Bran (DORB)', 'Dry processed rice bran byproduct, 16% protein content, pelletizable animal feed feedstock.', 200, 'tonnes/month', 'MEDIUM', 'CONTINUOUS', 'Indore', 'Madhya Pradesh', 'Vikram Singh', 'vikram@narmadaagro.in', '+91 98930 22114', false, false, 14500, 'INR'),
  ('supp_005', 'GreenForge Alloys', 'SUPPLIER', 'METAL', 'Cast Iron Swarf & Borings', 'Dry, un-contaminated machining chips from automotive cylinder block production.', 60, 'tonnes/month', 'MEDIUM', 'WEEKLY', 'Rajkot', 'Gujarat', 'Pravin Mehta', 'pravin@greenforge.in', '+91 98790 33221', false, false, 32000, 'INR'),
  ('supp_006', 'Delhi Industrial Solvents', 'SUPPLIER', 'CHEMICAL', 'Spent Toluene (Industrial Grade)', 'Recyclable byproduct toluene stream, 88% purity with trace resin washings. Regulated hazardous.', 30, 'kL/month', 'MEDIUM', 'MONTHLY', 'Delhi', 'Delhi', 'Anil Verma', 'anil@delhisolvents.com', '+91 98110 55443', true, false, 38000, 'INR'),
  ('supp_007', 'Malwa Bio-Energy Depot', 'SUPPLIER', 'FOOD_AGRO', 'Paddy Straw Bales (High Density)', 'Field-collected stubble biomass, moisture <14%, baled for industrial gasification/pelleting.', 500, 'tonnes/month', 'MEDIUM', 'WEEKLY', 'Ludhiana', 'Punjab', 'Harpreet Gill', 'harpreet@malwabio.in', '+91 98140 66778', false, false, 2800, 'INR'),
  ('supp_008', 'Deccan EcoPlast Industries', 'SUPPLIER', 'PLASTIC', 'HDPE Drum Regrind (Post-Industrial)', 'Washed blue HDPE regrind, melt flow index 0.08, suitable for non-pressure pipe extrusion.', 90, 'tonnes/month', 'HIGH', 'CONTINUOUS', 'Hyderabad', 'Telangana', 'K. Venkatesh', 'venkatesh@deccanecoplast.com', '+91 98490 77889', false, false, 56000, 'INR'),
  ('recv_101', 'Gujarat Synthetic Fibres Ltd.', 'RECEIVER', 'PLASTIC', 'Secondary PET Resin / Flakes', 'Seeking continuous supply of clean washed PET flakes for recycled PSF yarn spinning.', 100, 'tonnes/month', 'HIGH', 'CONTINUOUS', 'Surat', 'Gujarat', 'Manoj Shah', 'manoj@gujsynthetic.com', '+91 98251 99887', false, false, 44000, 'INR'),
  ('recv_102', 'Apex Yarn & Open-End Spinning', 'RECEIVER', 'TEXTILE', 'Cotton Waste / Comber Noil', 'Intake capacity for clean combed cotton spinning waste to blend with OE recycled yarn.', 90, 'tonnes/month', 'HIGH', 'CONTINUOUS', 'Tirupur', 'Tamil Nadu', 'R. Natarajan', 'natarajan@apexyarn.in', '+91 94432 11224', false, false, 30000, 'INR'),
  ('recv_103', 'Rajkot Precision Castings', 'RECEIVER', 'METAL', 'Secondary Aluminium Ingot / Scrap', 'Foundry requirement for 6063/alloy aluminium scrap for high-pressure die-cast pump housings.', 50, 'tonnes/month', 'HIGH', 'MONTHLY', 'Rajkot', 'Gujarat', 'Bhavesh Trivedi', 'bhavesh@rajkotprecision.in', '+91 98791 55667', false, false, 190000, 'INR'),
  ('recv_104', 'Ludhiana Pellet Mills Ltd.', 'RECEIVER', 'FOOD_AGRO', 'Agricultural Crop Residue / Husk', 'Consuming raw paddy straw, mustard husk and biomass for boiler briquette manufacturing.', 450, 'tonnes/month', 'MEDIUM', 'WEEKLY', 'Ludhiana', 'Punjab', 'Gurdeep Chawla', 'gurdeep@ludhianapellets.com', '+91 98141 33445', false, false, 3000, 'INR'),
  ('recv_105', 'Maharashtra Steel Re-Rolling', 'RECEIVER', 'METAL', 'Melting Grade Heavy Scrap / Swarf', 'Induction furnace intake for sorted CI/mild steel machining scrap and structural cuts.', 80, 'tonnes/month', 'MEDIUM', 'WEEKLY', 'Nagpur', 'Maharashtra', 'Sanjay Patil', 'sanjay@maharesteel.co.in', '+91 98221 66779', false, false, 34000, 'INR'),
  ('recv_106', 'CleanSol Refineries Pvt. Ltd.', 'RECEIVER', 'CHEMICAL', 'Recoverable Spent Industrial Solvents', 'Licensed CPCB/MPCB recovery plant for fractional distillation of toluene/IPA streams.', 40, 'kL/month', 'MEDIUM', 'MONTHLY', 'Vapi', 'Gujarat', 'Dinesh Gada', 'dinesh@cleansol.in', '+91 98240 77881', true, true, 40000, 'INR'),
  ('recv_107', 'Jaipur Non-Haz Chemical Blends', 'RECEIVER', 'CHEMICAL', 'Commercial Solvent Thinners', 'Blending facility for non-hazardous solvent mixtures and clean washes.', 25, 'kL/month', 'HIGH', 'MONTHLY', 'Jaipur', 'Rajasthan', 'Sunil Sharma', 'sunil@jaipurblends.in', '+91 94140 88990', false, false, 35000, 'INR'),
  ('recv_108', 'Tamil Nadu Bio-Char Corporation', 'RECEIVER', 'FOOD_AGRO', 'Biomass Agro-Residues', 'Pyrolysis facility converting agricultural residues and rice bran into soil conditioner biochar.', 220, 'tonnes/month', 'MEDIUM', 'CONTINUOUS', 'Salem', 'Tamil Nadu', 'V. Selvam', 'selvam@tnbiochar.in', '+91 94440 33441', false, false, 15000, 'INR')
ON CONFLICT (id) DO NOTHING;
