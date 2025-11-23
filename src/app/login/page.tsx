'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
// IMPORT CORRIGIDO: use getSupabase (lazy init)
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Use getSupabase inside effect (no import-time client)
    (async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) {
          router.push('/dashboard');
        }
      } catch (err) {
        // se env estiver faltando, getSupabase lança — aqui só logamos.
        console.debug('No supabase client yet or not logged in', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase(); // lazy init, garante env presente naquele momento
      const { data, error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;
      // login bem sucedido
      router.push('/dashboard');
    } catch (err: any) {
      // mensagens claras pro usuário
      const msg = err?.message || 'Erro ao entrar. Verifique email e senha.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-7 h-7 text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold">Bem-vindo de volta 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua conta com segurança</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="seu@email.com"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="email"
                required
              />
              <Mail className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
            </div>
            {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-gray-600"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Lock className="w-4 h-4 text-gray-700" />
            <span>Seus dados são protegidos com criptografia.</span>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60"
            aria-label="Entrar com segurança"
          >
            {loading ? 'Verificando...' : 'Entrar com segurança'}
          </button>

          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-sm text-gray-600">Esqueceu sua senha?</a>
          </div>
        </form>

        <footer className="text-center text-xs text-gray-400 mt-6">
          <a className="px-2">Termos de Uso</a>
          <span>•</span>
          <a className="px-2">Privacidade</a>
          <span>•</span>
          <a className="px-2">Suporte</a>
        </footer>
      </div>
    </div>
  );
}
