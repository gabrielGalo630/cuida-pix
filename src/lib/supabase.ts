// Client-safe Supabase wrapper with graceful fallback for preview/build environments
// This file should NOT include "use client" because it's a utility module imported
// by both client and server components. Keep exports standard so the bundler treats
// it as an ES module.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

type SafeSupabase = SupabaseClient | {
  from: (table: string) => any;
  auth: {
    getUser: () => Promise<any>;
    signInWithPassword: (...args: any[]) => Promise<any>;
  };
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SafeSupabase;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  // normal environment — create real client
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // fallback mock for preview/build environments where envs are missing
  supabase = {
    from: (table: string) => ({
      select: async (cols = "*") => ({ data: [], error: null }),
      order: () => ({ select: async () => ({ data: [], error: null }) }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
    },
  } as any;
}

export default supabase;
export { supabase };
