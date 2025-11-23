// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

/**
 * Client (browser) - usa ANON key pública.
 * Se as envs não estiverem definidas, logamos claramente (fail-fast).
 */
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!PUBLIC_URL) {
  // mensagem clara durante build/preview
  // no Lasy essa mensagem aparece nos logs/build e te ajuda a identificar env faltando
  // (não remove a execução para evitar crash silencioso em alguns previews)
  // eslint-disable-next-line no-console
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
}
if (!PUBLIC_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(PUBLIC_URL, PUBLIC_ANON_KEY);

/**
 * Admin (service role) - **SOMENTE** inicializado no server.
 * Não crie admin no bundle do cliente.
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
    throw new Error('getSupabaseAdmin() must be called from server-side code only.');
  }
  if (!_supabaseAdmin) {
    throw new Error('Supabase admin client not initialized. Ensure SUPABASE_SERVICE_ROLE_KEY is set in server env.');
  }
  return _supabaseAdmin;
}
