// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

/**
 * Client (usado pelo browser) - utiliza a ANON key pública.
 * -> NÃO expose SERVICE_ROLE_KEY para o browser.
 */
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  // fail fast during dev/build so você saiba qual env falta
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY (this is required for client-side Supabase)');
}

export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Admin (SERVICE ROLE) — somente criado no server.
 * Só inicializa se estivermos em server e a env SUPABASE_SERVICE_ROLE_KEY estiver definida.
 * Se não estiver definida, getSupabaseAdmin() lança erro claro.
 */
let _supabaseAdmin: SupabaseClient | null = null;

if (isServer && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  _supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!isServer) {
    throw new Error('getSupabaseAdmin() must be called from the server (not the browser).');
  }
  if (!_supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set or admin client not initialized.');
  }
  return _supabaseAdmin;
}
