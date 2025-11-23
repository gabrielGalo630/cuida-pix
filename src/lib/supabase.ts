import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase admin client for server-side operations (with service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types
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

// Helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

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
  return data.path;
}

export async function getFileUrl(path: string): Promise<string> {
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('uploads')
    .remove([path]);
  
  if (error) throw error;
}

export async function createVerification(verification: Omit<Verification, 'id' | 'created_at'>): Promise<Verification> {
  const { data, error } = await supabase
    .from('verifications')
    .insert(verification)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVerifications(userId: string, limit = 10, offset = 0): Promise<Verification[]> {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function getVerification(id: string): Promise<Verification | null> {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function incrementVerificationCount(userId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_verification_count', { user_id: userId });
  if (error) throw error;
}

export async function createLog(log: Omit<Log, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('logs')
    .insert(log);

  if (error) throw error;
}
