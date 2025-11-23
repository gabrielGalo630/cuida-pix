// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------
// CLIENTE DO FRONT-END (SEGURO) — usa somente ANON KEY
// ---------------------------------------------------------------------
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ---------------------------------------------------------------------
// CLIENTE ADMIN (BACKEND SOMENTE!!!)
// ---------------------------------------------------------------------
// OBS IMPORTANTE:
// ❌ Nunca pode rodar no navegador
// ✔ Só pode ser usado em rotas server-side,
//   como: server actions, route handlers, edge functions.
// ---------------------------------------------------------------------

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false }
    }
  )
}
