// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

let _supabaseClient: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Cria o client público (ANON) de forma preguiçosa (lazy).
 * Evita chamar createClient() durante import-time para não quebrar builds/previews
 * quando as envs não estão disponíveis ainda.
 */
export function getSupabase(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    // Mensagem clara para debugging no preview/build
    throw new Error('Missing Supabase public envs. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in the environment.');
  }

  _supabaseClient = createClient(url, anon);
  return _supabaseClient;
}

/**
 * Retorna o admin client (SERVICE ROLE) — somente server-side.
 * Lança erro se chamado no browser ou se a env não existir.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isServer) {
    throw new Error('getSupabaseAdmin() must be called from server-side code only.');
  }
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server env.');
  }

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  return _supabaseAdmin;
}
