'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");

  // Garante que window só será usado no navegador
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-12 h-12 text-[#FFD200]" />
            <span className="text-3xl font-bold text-white">Cuida-PIX</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400">Faça login para continuar protegendo seus pagamentos</p>
        </div>

        <div className="bg-gray-900 border border-[#FFD200]/20 rounded-2xl p-8">

          {origin && (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#FFD200',
                      brandAccent: '#E5BD00',
                      brandButtonText: '#000000',
                      defaultButtonBackground: '#000000',
                      defaultButtonBackgroundHover: '#1a1a1a',
                      defaultButtonBorder: '#FFD200',
                      defaultButtonText: '#FFFFFF',
                      dividerBackground: '#333333',
                      inputBackground: '#000000',
                      inputBorder: '#333333',
                      inputBorderHover: '#FFD200',
                      inputBorderFocus: '#FFD200',
                      inputText: '#FFFFFF',
                      inputLabelText: '#CCCCCC',
                      inputPlaceholder: '#666666',
                      messageText: '#FFFFFF',
                      messageTextDanger: '#EF4444',
                      anchorTextColor: '#FFD200',
                      anchorTextHoverColor: '#E5BD00',
                    }
                  }
                }
              }}
              providers={['google']}
              redirectTo={`${origin}/dashboard`}
              onlyThirdPartyProviders
            />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ao fazer login, você concorda com nossos{' '}
          <a href="/privacy" className="text-[#FFD200] hover:underline">
            Termos de Uso e Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
