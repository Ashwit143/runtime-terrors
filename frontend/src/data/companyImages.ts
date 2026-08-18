// Dedicated, Industry-Specific Realistic Visuals for Every Enterprise
// Stored in Vite static public assets for 100% production & local reliability

export const COMPANY_IMAGES: Record<string, string> = {
  // Suppliers
  supp_001: '/companies/aravalli-polymers.svg',        // PET Bottle Flake Washing & Sorting Line
  supp_002: '/companies/surya-textile.svg',           // Cotton Yarn Spinning Machinery & Spindles
  supp_003: '/companies/western-metal-recovery.svg',   // Aluminium 6063 Extrusion & Scrap Recovery
  supp_004: '/companies/narmada-agro.svg',             // Grain Silos & Paddy Rice Husk Processing
  supp_005: '/companies/greenforge-alloys.svg',       // CNC Fiber Laser Cutting & Steel Fabrication
  supp_006: '/companies/delhi-industrial-solvents.svg', // Chemical Fractional Distillation Columns
  supp_007: '/companies/malwa-bioenergy.svg',          // High-Density Paddy Straw Biomass Depot
  supp_008: '/companies/deccan-ecoplast.svg',         // HDPE Drum Shredder & Granulator Plant

  // Receivers
  recv_101: '/companies/gujarat-fibres.svg',          // Polyester Staple Fiber (PSF) Spinning Plant
  recv_102: '/companies/apex-yarn.svg',               // Open-End Rotor Spinning & Yarn Works
  recv_103: '/companies/rajkot-castings.svg',         // High-Pressure Aluminium Die Casting Foundry
  recv_104: '/companies/ludhiana-pellets.svg',        // Ring-Die Industrial Biomass Pellet Mill
  recv_105: '/companies/maharashtra-steel.svg',       // Induction Melting Furnace & TMT Rolling Mill
  recv_106: '/companies/cleansol-refineries.svg',     // Vacuum Solvent Distillation & Hazmat Plant
  recv_107: '/companies/jaipur-chemicals.svg',        // Chemical Reactor Kettles & Thinners Blending
  recv_108: '/companies/tamilnadu-biochar.svg',       // Rotary Pyrolysis Retort & Biochar Kiln
};

export const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  PLASTIC: '/companies/aravalli-polymers.svg',
  TEXTILE: '/companies/surya-textile.svg',
  METAL: '/companies/western-metal-recovery.svg',
  FOOD_AGRO: '/companies/narmada-agro.svg',
  CHEMICAL: '/companies/delhi-industrial-solvents.svg',
  RUBBER_MINERALS: '/companies/deccan-ecoplast.svg',
};

export const FALLBACK_INDUSTRIAL_IMAGE = '/companies/aravalli-polymers.svg';

export function getCompanyImage(companyId?: string, category?: string): string {
  if (companyId && COMPANY_IMAGES[companyId]) {
    return COMPANY_IMAGES[companyId];
  }
  if (category && CATEGORY_DEFAULT_IMAGES[category]) {
    return CATEGORY_DEFAULT_IMAGES[category];
  }
  return FALLBACK_INDUSTRIAL_IMAGE;
}
