import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'tallywise-supabase-url';
const STORAGE_KEY_KEY = 'tallywise-supabase-anon-key';

/**
 * Retrieve active Supabase URL from localStorage override or Vite .env
 */
export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_URL_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {}
  }
  return (import.meta.env.VITE_SUPABASE_URL || '').trim();
}

/**
 * Retrieve active Supabase Anon Key from localStorage override or Vite .env
 */
export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {}
  }
  return (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
}

/**
 * Check whether Supabase is properly configured with valid non-empty credentials
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.length > 20 &&
    !url.includes('your_supabase')
  );
}

/**
 * Save credentials to localStorage (enables 1-click test in Settings UI)
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (url.trim()) {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
    }
    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  } catch (e) {}
}

/**
 * Clear custom Supabase credentials from localStorage
 */
export function clearSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  } catch (e) {}
}

let clientInstance: SupabaseClient | null = null;
let currentConfigKey = '';

/**
 * Get or initialize the Supabase client
 */
export function getSupabase(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const configKey = `${url}::${key}`;

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance || currentConfigKey !== configKey) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      currentConfigKey = configKey;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
}

export const supabase = getSupabase();
