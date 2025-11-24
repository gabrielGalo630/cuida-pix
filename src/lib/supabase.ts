// src/lib/supabase.ts
// Cliente Supabase seguro que funciona em preview/build/prod.
// NÃO coloque "use client" aqui — é um módulo utilitário importado por client + server.

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
  // ambiente normal -> cliente real
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // fallback seguro para preview/build (não quebra o bundler)
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
