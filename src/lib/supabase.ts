import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Se não houver credenciais, criar um cliente "mock" que não faz requisições
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Using fallback mode.')
  
  // Cliente mock que retorna erros amigáveis
  export const supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ 
        data: { user: null, session: null }, 
        error: { message: 'Supabase não configurado. Configure as variáveis de ambiente.' } 
      }),
      signUp: async () => ({ 
        data: { user: null, session: null }, 
        error: { message: 'Supabase não configurado. Configure as variáveis de ambiente.' } 
      }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({ 
        data: { provider: null, url: null }, 
        error: { message: 'Supabase não configurado. Configure as variáveis de ambiente.' } 
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              abortSignal: () => Promise.resolve({ data: [], error: null })
            })
          })
        })
      })
    })
  } as any
} else {
  // Cliente real do Supabase
  export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'x-application-name': 'cuida-pix'
        },
        fetch: (url, options = {}) => {
          // Adicionar timeout de 5 segundos para todas as requisições
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
          })
            .finally(() => clearTimeout(timeoutId))
            .catch((error) => {
              // Tratar erros de rede silenciosamente
              if (error.name === 'AbortError') {
                throw new Error('Request timeout')
              }
              throw error
            })
        }
      }
    }
  )
}
