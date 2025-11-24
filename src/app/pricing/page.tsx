'use client';

import Link from 'next/link';
import { Shield, Check, Zap, Crown, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/custom/Button';
import { Footer } from '@/components/custom/Footer';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 19,
      description: 'Perfeito para uso pessoal',
      icon: <Shield className="w-6 h-6" />,
      features: [
        '10 análises por mês',
        'Análise de comprovantes',
        'Score de risco básico',
        'Suporte por email',
        'Histórico de 30 dias',
      ],
      highlighted: false,
    },
    {
      name: 'Plus',
      price: 39,
      description: 'Ideal para profissionais',
      icon: <Zap className="w-6 h-6" />,
      features: [
        '50 análises por mês',
        'Análise avançada com IA',
        'Score detalhado + recomendações',
        'Suporte prioritário',
        'Histórico ilimitado',
        'Relatórios em PDF',
        'API de integração',
      ],
      highlighted: true,
    },
    {
      name: 'Ultra',
      price: 59,
      description: 'Para empresas e alto volume',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Análises ilimitadas',
        'IA de última geração',
        'Análise em tempo real',
        'Suporte 24/7 dedicado',
        'Dashboard empresarial',
        'Relatórios customizados',
        'API completa',
        'Treinamento da equipe',
        'Consultoria de segurança',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-[#F6C90E]/10 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F6C90E] transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Planos e Preços</h1>
              <p className="text-gray-400 mt-1">Escolha o plano ideal para você</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero */}
          <section className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#F6C90E]/30 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#F6C90E]" />
              <span className="text-sm font-semibold text-[#F6C90E]">7 Dias de Garantia</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Proteção Premium para<br />
              <span className="bg-gradient-to-r from-[#F6C90E] to-[#FFE347] bg-clip-text text-transparent">
                Todos os Perfis
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Escolha o plano que melhor se adapta às suas necessidades. Todos incluem nossa tecnologia de IA avançada.
            </p>
          </section>

          {/* Plans */}
          <section className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-[#1A1A1A] rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? 'border-2 border-[#F6C90E] shadow-2xl shadow-[#F6C90E]/20 scale-105'
                    : 'border border-[#F6C90E]/20 hover:border-[#F6C90E]/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#F6C90E] to-[#FFE347] text-[#0D0D0D] text-sm font-bold rounded-full">
                    Mais Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.highlighted ? 'bg-[#F6C90E] text-[#0D0D0D]' : 'bg-[#F6C90E]/10 text-[#F6C90E]'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold">R$ {plan.price}</span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-[#F6C90E]' : 'text-gray-400'
                      }`} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                    size="lg"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            ))}
          </section>

          {/* Guarantee */}
          <section className="bg-[#1A1A1A] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#F6C90E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-[#F6C90E]" />
            </div>
            <h3 className="text-2xl font-extrabold mb-4">Garantia de 7 Dias</h3>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experimente qualquer plano sem riscos. Se não ficar satisfeito, devolvemos 100% do seu dinheiro em até 7 dias.
            </p>
          </section>

          {/* Comparison */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Comparação Detalhada</h3>
            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0D0D0D]">
                    <tr>
                      <th className="text-left p-6 font-bold">Recurso</th>
                      <th className="text-center p-6 font-bold">Starter</th>
                      <th className="text-center p-6 font-bold text-[#F6C90E]">Plus</th>
                      <th className="text-center p-6 font-bold">Ultra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F6C90E]/10">
                    {[
                      { feature: 'Análises mensais', starter: '10', plus: '50', ultra: 'Ilimitadas' },
                      { feature: 'Score de risco', starter: 'Básico', plus: 'Avançado', ultra: 'Elite' },
                      { feature: 'Suporte', starter: 'Email', plus: 'Prioritário', ultra: '24/7 Dedicado' },
                      { feature: 'Histórico', starter: '30 dias', plus: 'Ilimitado', ultra: 'Ilimitado' },
                      { feature: 'Relatórios PDF', starter: '—', plus: '✓', ultra: '✓' },
                      { feature: 'API', starter: '—', plus: 'Básica', ultra: 'Completa' },
                      { feature: 'Dashboard empresarial', starter: '—', plus: '—', ultra: '✓' },
                      { feature: 'Consultoria', starter: '—', plus: '—', ultra: '✓' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#0D0D0D]/50 transition-colors">
                        <td className="p-6 text-gray-300">{row.feature}</td>
                        <td className="p-6 text-center text-gray-400">{row.starter}</td>
                        <td className="p-6 text-center text-[#F6C90E] font-semibold">{row.plus}</td>
                        <td className="p-6 text-center text-gray-300">{row.ultra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Perguntas Frequentes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: 'Posso cancelar a qualquer momento?',
                  answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas adicionais.',
                },
                {
                  question: 'Como funciona a garantia?',
                  answer: 'Se não ficar satisfeito em até 7 dias, devolvemos 100% do valor pago, sem perguntas.',
                },
                {
                  question: 'Posso mudar de plano depois?',
                  answer: 'Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.',
                },
                {
                  question: 'Aceitam quais formas de pagamento?',
                  answer: 'Aceitamos cartão de crédito, PIX e boleto bancário para sua comodidade.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all"
                >
                  <h4 className="font-bold mb-3">{faq.question}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl p-12 text-[#0D0D0D] text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
              Pronto para se Proteger?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de brasileiros que já confiam no Cuida-PIX
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <button className="px-8 py-4 bg-[#0D0D0D] text-white font-bold text-lg rounded-xl hover:bg-[#1A1A1A] transition-all shadow-2xl hover:scale-105">
                  Começar Agora
                </button>
              </Link>
              <Link href="/analyze">
                <button className="px-8 py-4 bg-white text-[#0D0D0D] font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
                  Testar Gratuitamente
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
