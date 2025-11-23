// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Detecta ambiente (server vs client)
const isServer = typeof window === 'undefined';

// Client-safe Supabase (padrão, usa ANON key)
export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin (SERVICE ROLE) — **somente** no servidor.
// Se não estivermos no server, não cria para evitar vazamento do service role.
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

/**
 * Pegar o admin client (server-only). Vai lançar erro se usado no cliente.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    throw new Error('Supabase admin client is only available on the server. Ensure you call this from a server-side function and that SUPABASE_SERVICE_ROLE_KEY is set.');
  }
  return _supabaseAdmin;
}

/* -------------------------
   Tipos (DB)
   ------------------------- */
export interface Verification {
  id: string;
  user_id: string;
  type: 'pix' | 'qr' | 'link' | 'text';
  input_text?: string;
  input_url?: string;
  file_path?: string;
  score: number;
  risk_level: 'safe' | 'attention' | 'high_risk';
  reasons: string[];
  recommendations: string[];
  metadata: Record<string, any>;
  created_at: string;
}

/* (subscription/log types kept as before) */
export interface Subscription {
  id: string;
  user_id: string;
  kirvano_subscription_id?: string;
  plan_type: 'basic' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  verifications_limit: number;
  verifications_used: number;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Log {
  id: string;
  user_id?: string;
  event_type: string;
  event_data: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

/* -------------------------
   Helpers / API wrappers
   ------------------------- */

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return (data as any)?.user ?? null;
}

/**
 * signInWithGoogle: não usa window internamente.
 * Se você precisa redirecionar para dashboard, passe redirectTo como parâmetro
 * a partir do componente cliente (ex: redirectTo={window.location.origin + '/dashboard'}).
 */
export async function signInWithGoogle(redirectTo?: string) {
  const options = redirectTo ? { redirectTo } : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Upload de arquivo para o bucket 'uploads'
 * - Executar no cliente é OK (usa ANON key). Se quiser upload server-side, use getSupabaseAdmin().
 */
export async function uploadFile(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  // data.path é o retorno esperado pelo supabase v2 upload
  return (data as any).path;
}

/**
 * Gera URL pública (note: bucket privado requer signed URL via admin)
 */
export async function getFileUrl(path: string): Promise<string> {
  const { data, error } = supabase.storage
    .from('uploads')
    .getPublicUrl(path);

  if (error) {
    throw error;
  }
  return (data as any).publicUrl;
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('uploads')
    .remove([path]);

  if (error) throw error;
}

/* -------------------------
   Verifications / DB helpers
   ------------------------- */

/**
 * createVerification — usa client (ANON). Em casos onde você precisa de service_role (por exemplo inserção com columns que precisam do role),
 * chame getSupabaseAdmin() dentro de uma rota server-side e execute lá.
 */
export async function createVerification(verification: Omit<Verification, 'id' | 'created_at'>): Promise<Verification> {
  const { data, error } = await supabase
    .from('verifications')
    .insert(verification)
    .select()
    .single();

  if (error) throw error;
  return data as Verification;
}

export async function getVerifications(userId: string, limit = 10, offset = 0): Promise<Verification[]> {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Verification[]) || [];
}

export async function getVerification(id: string): Promise<Verification | null> {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116: not found (keeps backward compat)
    if ((error as any).code === 'PGRST116') return null;
    throw error;
  }
  return data as Verification;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    if ((error as any).code === 'PGRST116') return null;
    throw error;
  }
  return data as Subscription | null;
}

export async function incrementVerificationCount(userId: string): Promise<void> {
  // RPC must be created in Supabase (increment_verification_count)
  if (!isServer) {
    // try to prevent client calling server-only RPC directly; allow if needed
    console.warn('incrementVerificationCount called from client; prefer server-side.');
  }
  const { error } = await (isServer ? getSupabaseAdmin() : supabase)
    .rpc('increment_verification_count', { user_id: userId });
  if (error) throw error;
}

export async function createLog(log: Omit<Log, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('logs')
    .insert(log);

  if (error) throw error;
}
