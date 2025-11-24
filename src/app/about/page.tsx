'use client';

import Link from 'next/link';
import { Shield, Target, Heart, Users, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/custom/Button';
import { Footer } from '@/components/custom/Footer';

export default function AboutPage() {
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
              <Users className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Equipe & Visão</h1>
              <p className="text-gray-400 mt-1">Quem somos e o que nos move</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Mission */}
          <section className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#F6C90E]/30 rounded-full mb-8">
              <Target className="w-4 h-4 text-[#F6C90E]" />
              <span className="text-sm font-semibold text-[#F6C90E]">Nossa Missão</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Proteger Brasileiros de<br />
              <span className="bg-gradient-to-r from-[#F6C90E] to-[#FFE347] bg-clip-text text-transparent">
                Golpes Digitais
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Nascemos com o propósito de democratizar a segurança digital no Brasil, oferecendo tecnologia de ponta acessível a todos que realizam transações via PIX.
            </p>
          </section>

          {/* Story */}
          <section className="bg-[#1A1A1A] rounded-2xl p-12">
            <h3 className="text-3xl font-extrabold mb-8 text-center">Nossa História</h3>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-300 leading-relaxed">
              <p>
                O Cuida-PIX nasceu em 2024, quando um grupo de especialistas em segurança digital e inteligência artificial se uniu com um objetivo claro: <span className="text-[#F6C90E] font-semibold">combater a epidemia de golpes via PIX no Brasil</span>.
              </p>
              <p>
                Vimos milhares de brasileiros perdendo suas economias para golpistas cada vez mais sofisticados. Comprovantes falsos, QR Codes adulterados e mensagens manipuladoras se tornaram armas poderosas nas mãos de criminosos.
              </p>
              <p>
                Decidimos agir. Reunimos as melhores tecnologias de IA disponíveis e criamos um sistema capaz de <span className="text-[#F6C90E] font-semibold">detectar fraudes em segundos</span>, com precisão superior a 98%.
              </p>
              <p>
                Hoje, já protegemos milhares de usuários e analisamos mais de <span className="text-[#F6C90E] font-semibold">23 milhões de transações</span>. Mas nossa missão está apenas começando.
              </p>
            </div>
          </section>

          {/* Values */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Nossos Valores</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: 'Segurança Primeiro',
                  description: 'Proteção dos nossos usuários é nossa prioridade absoluta. Investimos constantemente em tecnologia e segurança.',
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: 'Transparência Total',
                  description: 'Somos claros sobre como nossa tecnologia funciona e como protegemos seus dados. Sem segredos.',
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: 'Inovação Contínua',
                  description: 'Golpistas evoluem constantemente. Nossa IA também. Atualizamos nossos modelos diariamente.',
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 hover:border-[#F6C90E]/50 transition-all"
                >
                  <div className="w-14 h-14 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-6 text-[#F6C90E]">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Equipe de Elite</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  name: 'Dr. Carlos Silva',
                  role: 'CEO & Fundador',
                  expertise: 'PhD em IA, ex-Google',
                },
                {
                  name: 'Ana Rodrigues',
                  role: 'CTO',
                  expertise: 'Especialista em ML, ex-Microsoft',
                },
                {
                  name: 'Pedro Santos',
                  role: 'Head of Security',
                  expertise: 'Segurança Bancária, 15 anos',
                },
                {
                  name: 'Julia Costa',
                  role: 'Head of Product',
                  expertise: 'UX/UI, ex-Nubank',
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 text-center hover:border-[#F6C90E]/50 transition-all"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F6C90E]/20 to-[#FFE347]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-[#F6C90E]" />
                  </div>
                  <h4 className="font-bold mb-1">{member.name}</h4>
                  <p className="text-sm text-[#F6C90E] mb-2">{member.role}</p>
                  <p className="text-xs text-gray-400">{member.expertise}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className="bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl p-12 text-[#0D0D0D]">
            <h3 className="text-3xl font-extrabold mb-12 text-center">Conquistas</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="w-8 h-8" />,
                  title: 'Prêmio Inovação 2024',
                  description: 'Melhor Startup de Segurança Digital',
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: '+50.000 Usuários',
                  description: 'Protegidos em todo o Brasil',
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: 'R$ 120M Protegidos',
                  description: 'Em transações verificadas',
                },
              ].map((achievement, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-[#0D0D0D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {achievement.icon}
                  </div>
                  <h4 className="font-bold mb-2">{achievement.title}</h4>
                  <p className="text-sm opacity-80">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Commitment */}
          <section className="bg-[#1A1A1A] rounded-2xl p-12">
            <h3 className="text-3xl font-extrabold mb-8 text-center">Nosso Compromisso</h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  title: 'Combate Ativo a Golpes',
                  description: 'Trabalhamos diariamente para identificar novos padrões de fraude e atualizar nossa IA.',
                },
                {
                  title: 'Educação Financeira',
                  description: 'Compartilhamos conhecimento sobre segurança digital através de conteúdo educativo gratuito.',
                },
                {
                  title: 'Parceria com Autoridades',
                  description: 'Colaboramos com polícia e órgãos reguladores para combater crimes digitais.',
                },
                {
                  title: 'Acessibilidade',
                  description: 'Mantemos planos acessíveis para que todos possam se proteger, independente da renda.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-[#0D0D0D] rounded-xl p-6"
                >
                  <div className="w-8 h-8 bg-[#F6C90E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#F6C90E] font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
              Junte-se a Nós Nessa Missão
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Faça parte da comunidade que está mudando a segurança digital no Brasil
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg">
                  Ver Planos
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="outline" size="lg">
                  Testar Gratuitamente
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
