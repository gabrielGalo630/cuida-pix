import Link from 'next/link';
import { Shield, Lock, Zap, CheckCircle } from 'lucide-react';
import { LowPolyCube } from '@/components/custom/3d-cube';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD200]/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <LowPolyCube />
          
          <Link href="/login">
            <Button className="mt-12 bg-[#FFD200] text-black hover:bg-[#FFD200]/90 text-lg px-8 py-6 h-auto font-semibold">
              Começar — Login com Google
            </Button>
          </Link>

          <p className="mt-6 text-sm text-gray-400">
            Cuida-PIX não é um órgão oficial. As análises são recomendações automatizadas<br />
            e não substituem investigação policial. Em caso de suspeita de golpe,<br />
            denuncie às autoridades competentes.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Como funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/50 border border-[#FFD200]/20 rounded-2xl p-8 hover:border-[#FFD200]/40 transition-all">
              <div className="w-12 h-12 bg-[#FFD200]/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#FFD200]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise Inteligente</h3>
              <p className="text-gray-400">
                Nossa IA analisa comprovantes, QR codes, links e textos em segundos,
                identificando padrões de fraude com precisão.
              </p>
            </div>

            <div className="bg-black/50 border border-[#FFD200]/20 rounded-2xl p-8 hover:border-[#FFD200]/40 transition-all">
              <div className="w-12 h-12 bg-[#FFD200]/10 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#FFD200]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Segurança Total</h3>
              <p className="text-gray-400">
                Seus dados são protegidos com criptografia de ponta a ponta.
                Informações sensíveis são mascaradas automaticamente.
              </p>
            </div>

            <div className="bg-black/50 border border-[#FFD200]/20 rounded-2xl p-8 hover:border-[#FFD200]/40 transition-all">
              <div className="w-12 h-12 bg-[#FFD200]/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#FFD200]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Resultados Rápidos</h3>
              <p className="text-gray-400">
                Receba um score de risco detalhado com recomendações práticas
                em menos de 30 segundos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Por que usar o Cuida-PIX?
          </h2>

          <div className="space-y-6">
            {[
              'Detecta links encurtados e domínios suspeitos',
              'Identifica linguagem urgente e ameaças',
              'Analisa inconsistências em comprovantes',
              'Verifica formato de chaves PIX',
              'Histórico completo de todas as análises',
              'Exportação de relatórios em PDF',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#FFD200] flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/login">
              <Button className="bg-[#FFD200] text-black hover:bg-[#FFD200]/90 text-lg px-8 py-6 h-auto font-semibold">
                Analisar agora — Login com Google
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-[#FFD200]/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-[#FFD200]" />
            <span className="text-lg font-bold">Cuida-PIX</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Proteção avançada para seus pagamentos
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-[#FFD200] transition-colors">
              Privacidade
            </Link>
            <span>•</span>
            <span>© 2024 Cuida-PIX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
