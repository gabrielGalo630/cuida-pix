'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
    });

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
          <h1 className="text-2xl font-bold text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400">
            Faça login para continuar protegendo seus pagamentos
          </p>
        </div>

        <div className="bg-gray-900 border border-[#FFD200]/20 rounded-2xl p-8">
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
                  },
                  space: {
                    spaceSmall: '4px',
                    spaceMedium: '8px',
                    spaceLarge: '16px',
                    labelBottomMargin: '8px',
                    anchorBottomMargin: '4px',
                    emailInputSpacing: '4px',
                    socialAuthSpacing: '4px',
                    buttonPadding: '10px 15px',
                    inputPadding: '10px 15px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/dashboard`}
            onlyThirdPartyProviders
            localization={{
              variables: {
                sign_in: {
                  social_provider_text: 'Entrar com {{provider}}',
                },
              },
            }}
          />
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
