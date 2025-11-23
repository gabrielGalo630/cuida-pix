// Client-safe Supabase wrapper with graceful fallback for preview/build environments
// Replace with your real Supabase client import when deploying (keeps same API surface)

"use client";

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
  // ambiente normal — cria o client real
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // fallback "mock" para ambientes de preview/build sem envs — evita que o bundler
  // quebre com import/export e fornece uma API mínima que o app espera.
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

export { supabase };
export default supabase;
