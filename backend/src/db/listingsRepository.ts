import { supabase } from './supabaseClient.js';
import { Listing } from '../types/index.js';
import { SEED_LISTINGS } from '../data/seedListings.js';

// In-memory working cache for rapid deterministic 5-factor scoring
let memoryListings: Listing[] = [...SEED_LISTINGS];
let isInitialized = false;

// Convert Supabase DB snake_case record to Application Listing
export function mapDbRowToListing(row: any): Listing {
  return {
    id: row.id,
    companyName: row.company_name,
    type: row.type,
    category: row.category,
    materialName: row.material_name,
    description: row.description || '',
    quantity: Number(row.quantity),
    unit: row.unit || 'tonnes/month',
    qualityGrade: row.quality_grade,
    frequency: row.frequency,
    city: row.city,
    state: row.state || '',
    contactPerson: row.contact_person || '',
    email: row.email || '',
    phone: row.phone || '',
    isHazardous: Boolean(row.is_hazardous),
    isHazmatLicensed: Boolean(row.is_hazmat_licensed),
    pricePerUnit: row.price_per_unit ? Number(row.price_per_unit) : undefined,
    currency: row.currency || 'INR',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Convert Application Listing to Supabase DB snake_case record
export function mapListingToDbRow(l: Partial<Listing>): Record<string, any> {
  return {
    id: l.id,
    company_name: l.companyName,
    type: l.type,
    category: l.category,
    material_name: l.materialName,
    description: l.description || null,
    quantity: l.quantity !== undefined ? Number(l.quantity) : 0,
    unit: l.unit || 'tonnes/month',
    quality_grade: l.qualityGrade || 'MEDIUM',
    frequency: l.frequency || 'MONTHLY',
    city: l.city,
    state: l.state || null,
    contact_person: l.contactPerson || null,
    email: l.email || null,
    phone: l.phone || null,
    is_hazardous: Boolean(l.isHazardous),
    is_hazmat_licensed: Boolean(l.isHazmatLicensed),
    price_per_unit: l.pricePerUnit !== undefined ? Number(l.pricePerUnit) : null,
    currency: l.currency || 'INR',
    created_at: l.createdAt || new Date().toISOString(),
  };
}

/**
 * Automatically ensures Supabase database contains initial seed data
 */
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('listings').select('id').limit(1);

      if (error) {
        console.warn('Supabase query error during initialization check:', error.message);
      } else if (!data || data.length === 0) {
        console.log('🌱 Supabase listings table is empty. Seeding initial Indian industrial dataset...');
        const rows = SEED_LISTINGS.map(mapListingToDbRow);
        const { error: insertErr } = await supabase.from('listings').insert(rows);
        if (insertErr) {
          console.error('Failed to insert seed data into Supabase:', insertErr.message);
        } else {
          console.log(`✅ Successfully seeded ${SEED_LISTINGS.length} enterprises into Supabase PostgreSQL.`);
        }
      } else {
        // Load existing records from Supabase into memory cache
        const { data: allRows } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
        if (allRows && allRows.length > 0) {
          memoryListings = allRows.map(mapDbRowToListing);
          console.log(`📦 Synchronized ${memoryListings.length} listings from Supabase PostgreSQL.`);
        }
      }
    } catch (err) {
      console.error('Database sync error:', err);
    }
  }

  isInitialized = true;
}

/**
 * Get all listings with optional filters
 */
export async function getAllListings(filters?: {
  type?: string;
  category?: string;
  city?: string;
}): Promise<Listing[]> {
  await initializeDatabase();

  if (supabase) {
    try {
      let query = supabase.from('listings').select('*').order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type.toUpperCase());
      }
      if (filters?.category) {
        query = query.eq('category', filters.category.toUpperCase());
      }
      if (filters?.city) {
        query = query.ilike('city', filters.city);
      }

      const { data, error } = await query;
      if (!error && data) {
        const fetched = data.map(mapDbRowToListing);
        memoryListings = fetched; // refresh cache
        return fetched;
      }
    } catch (err) {
      console.warn('Falling back to cache due to Supabase query error:', err);
    }
  }

  // In-memory fallback
  let results = [...memoryListings];
  if (filters?.type) {
    results = results.filter((l) => l.type === filters.type!.toUpperCase());
  }
  if (filters?.category) {
    results = results.filter((l) => l.category === filters.category!.toUpperCase());
  }
  if (filters?.city) {
    results = results.filter((l) => l.city.toLowerCase() === filters.city!.toLowerCase());
  }

  return results;
}

/**
 * Get single listing by ID
 */
export async function getListingById(id: string): Promise<Listing | null> {
  await initializeDatabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
      if (!error && data) {
        return mapDbRowToListing(data);
      }
    } catch (err) {
      console.warn('Supabase query by ID error:', err);
    }
  }

  return memoryListings.find((l) => l.id === id) || null;
}

/**
 * Save new listing into Supabase and memory cache
 */
export async function createNewListing(listingData: Partial<Listing>): Promise<Listing> {
  await initializeDatabase();

  const newListing: Listing = {
    id: listingData.id || `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: listingData.type || 'SUPPLIER',
    companyName: listingData.companyName || 'Industrial Facility',
    contactPerson: listingData.contactPerson || '',
    email: listingData.email || '',
    phone: listingData.phone || '',
    city: listingData.city || 'Pune',
    state: listingData.state || '',
    category: listingData.category || 'PLASTIC',
    materialName: listingData.materialName || `${listingData.category || 'Industrial'} Material`,
    description: listingData.description || '',
    quantity: Number(listingData.quantity || 100),
    unit: listingData.unit || 'tonnes/month',
    qualityGrade: listingData.qualityGrade || 'MEDIUM',
    frequency: listingData.frequency || 'MONTHLY',
    isHazardous: Boolean(listingData.isHazardous),
    isHazmatLicensed: Boolean(listingData.isHazmatLicensed),
    pricePerUnit: listingData.pricePerUnit ? Number(listingData.pricePerUnit) : undefined,
    currency: listingData.currency || 'INR',
    createdAt: new Date().toISOString(),
  };

  // 1. Update in-memory store immediately
  memoryListings.unshift(newListing);

  // 2. Persist to Supabase if connected
  if (supabase) {
    try {
      const row = mapListingToDbRow(newListing);
      const { error } = await supabase.from('listings').insert(row);
      if (error) {
        console.error('Failed to insert listing into Supabase:', error.message);
      } else {
        console.log(`✅ Stored listing ${newListing.id} in Supabase PostgreSQL.`);
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }

  return newListing;
}

/**
 * Reset database to default synthetic Indian seed data
 */
export async function resetDatabaseStore(): Promise<void> {
  memoryListings = [...SEED_LISTINGS];

  if (supabase) {
    try {
      await supabase.from('listings').delete().neq('id', '___none___');
      const rows = SEED_LISTINGS.map(mapListingToDbRow);
      await supabase.from('listings').insert(rows);
      console.log('✅ Supabase PostgreSQL reset to default seed records.');
    } catch (err) {
      console.error('Failed to reset Supabase records:', err);
    }
  }
}
