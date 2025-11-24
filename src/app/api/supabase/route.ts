// src/app/api/supabase/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use uma chave segura para server
)

export async function POST(req: Request) {
  const body = await req.json()
  const { action, userId } = body

  if (action === 'get-user') {
    // Exemplo: retornar user by id (ajuste pra sua necessidade)
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    return NextResponse.json({ data, error })
  }

  // Retorno padrão
  return NextResponse.json({ ok: true })
}
