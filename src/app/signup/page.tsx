'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validações
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email já está cadastrado. Faça login ou use outro email.');
        } else if (signUpError.message.includes('Password should be')) {
          setPasswordError('A senha deve ter no mínimo 6 caracteres');
        } else if (signUpError.message.includes('Failed to fetch') || signUpError.message.includes('Network')) {
          setError('Erro de conexão. Verifique sua internet e tente novamente.');
        } else {
          setError('Erro ao criar conta. Tente novamente mais tarde.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Redirecionar para dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('Network')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError('Erro ao conectar com Google. Tente novamente.');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F6C90E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFE347]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F6C90E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Voltar para home</span>
        </Link>

        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#0D0D0D]" />
            </div>
            <span className="text-2xl font-extrabold text-white">Cuida-PIX</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Crie sua conta 🚀
          </h1>
          <p className="text-gray-400 text-base">
            Proteção contra golpes em segundos
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Nome Completo */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError('');
                  }}
                  placeholder="Seu nome completo"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0D0D0D] border border-[#F6C90E]/20 rounded-xl text-white 
                    placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F6C90E]/50 
                    focus:border-[#F6C90E] transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setError('');
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="seu@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#0D0D0D] border rounded-xl text-white placeholder:text-gray-600 
                    focus:outline-none focus:ring-2 transition-all duration-200
                    ${emailError 
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                      : 'border-[#F6C90E]/20 focus:ring-[#F6C90E]/50 focus:border-[#F6C90E]'
                    }`}
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                    setError('');
                  }}
                  onBlur={handlePasswordBlur}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#0D0D0D] border rounded-xl text-white 
                    placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all duration-200
                    ${passwordError 
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                      : 'border-[#F6C90E]/20 focus:ring-[#F6C90E]/50 focus:border-[#F6C90E]'
                    }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F6C90E] 
                    transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite a senha novamente"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#0D0D0D] border border-[#F6C90E]/20 rounded-xl text-white 
                    placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F6C90E]/50 
                    focus:border-[#F6C90E] transition-all duration-200"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F6C90E] 
                    transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Badge de Segurança */}
            <div className="bg-[#0D0D0D] border border-[#F6C90E]/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F6C90E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-[#F6C90E]" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Seus dados são protegidos com <span className="text-[#F6C90E] font-semibold">criptografia bancária</span>.
              </p>
            </div>

            {/* Botão Principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F6C90E] to-[#FFE347] text-[#0D0D0D] font-bold py-4 rounded-xl 
                hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#0D0D0D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Criando sua conta...</span>
                </>
              ) : (
                'Criar Conta com Segurança'
              )}
            </button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F6C90E]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1A1A1A] text-gray-500">ou</span>
              </div>
            </div>

            {/* Botão Google (Opcional) */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white text-[#0D0D0D] font-semibold py-4 rounded-xl 
                hover:bg-gray-100 transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 border border-gray-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>

            {/* Link para Login */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-400">
                Já tem conta?{' '}
                <Link href="/login" className="text-[#F6C90E] hover:text-[#FFE347] font-semibold transition-colors">
                  Entrar
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <a href="/terms" className="hover:text-[#F6C90E] transition-colors">
              Termos de Uso
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-[#F6C90E] transition-colors">
              Privacidade
            </a>
            <span>•</span>
            <a href="/support" className="hover:text-[#F6C90E] transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
