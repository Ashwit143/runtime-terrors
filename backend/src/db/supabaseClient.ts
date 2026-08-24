import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log(`🔌 Supabase PostgreSQL client connected: ${supabaseUrl}`);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabase = null;
  }
} else {
  console.log('ℹ️  No SUPABASE_URL / SUPABASE_KEY detected. Using resilient in-memory industrial database.');
}

export { supabase };
