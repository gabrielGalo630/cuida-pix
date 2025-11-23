// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

let _supabaseClient: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Client público — lazy init
 * Evita erro de createClient durante import.
 */
export function getSupabase(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      'Supabase public env missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  _supabaseClient = createClient(url, anon);
  return _supabaseClient;
}

/**
 * Admin — server only
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isServer) {
    throw new Error('getSupabaseAdmin() cannot run on client');
  }
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on server env.'
    );
  }

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return _supabaseAdmin;
}
