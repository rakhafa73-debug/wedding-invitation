import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Also check localStorage for quick runtime connection testing without rebuild
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('NUPTIA_SUPABASE_URL') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('NUPTIA_SUPABASE_KEY') || '' : '';

export const supabaseUrl = storedUrl || envUrl;
export const supabaseAnonKey = storedKey || envKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey !== 'your-anon-key-here'
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

export function updateSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('NUPTIA_SUPABASE_URL', url.trim());
    localStorage.setItem('NUPTIA_SUPABASE_KEY', key.trim());
    window.location.reload();
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('NUPTIA_SUPABASE_URL');
    localStorage.removeItem('NUPTIA_SUPABASE_KEY');
    window.location.reload();
  }
}
