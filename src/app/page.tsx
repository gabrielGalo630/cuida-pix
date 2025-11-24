'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Zap, Lock, CheckCircle, TrendingUp, Users, Award, ArrowRight, Sparkles, Brain, Eye, ChevronRight } from 'lucide-react';
import { Button } from '@/components/custom/Button';
import { Footer } from '@/components/custom/Footer';

export default function HomePage() {
  const [analysisCount, setAnalysisCount] = useState(23482109);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6C90E]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F6C90E]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFE347]/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#F6C90E]/30 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#F6C90E]" />
            <span className="text-sm font-semibold text-[#F6C90E]">Tecnologia Proprietária 2025™</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            A IA Nº1 do Brasil para<br />
            <span className="bg-gradient-to-r from-[#F6C90E] to-[#FFE347] bg-clip-text text-transparent">
              Detectar Golpes em PIX
            </span>
            <br />e QR Codes
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Análise instantânea. Precisão de elite. Segurança real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/analyze">
              <Button size="lg" className="w-full sm:w-auto group">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Analisar Comprovante
              </Button>
            </Link>
          </div>

          {/* Counter */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#F6C90E]/20 rounded-2xl">
            <div className="w-2 h-2 bg-[#F6C90E] rounded-full animate-pulse" />
            <span className="text-gray-400 text-sm">
              <span className="text-[#F6C90E] font-bold text-lg">{analysisCount.toLocaleString('pt-BR')}</span> análises realizadas
            </span>
          </div>

          {/* 3D Illustration Placeholder */}
          <div className="mt-16 relative">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#F6C90E]/20 to-[#FFE347]/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-[#F6C90E]/30">
              <Shield className="w-32 h-32 text-[#F6C90E]" />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FFE347]/20 rounded-2xl rotate-12 animate-bounce" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#F6C90E]/20 rounded-2xl -rotate-12 animate-bounce delay-500" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-400">
              Proteção em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Eye className="w-8 h-8" />,
                title: 'Envie o Comprovante',
                description: 'Faça upload da imagem, QR Code, link ou texto do PIX que deseja verificar.',
              },
              {
                step: '02',
                icon: <Brain className="w-8 h-8" />,
                title: 'IA Analisa em Tempo Real',
                description: 'Nossa inteligência artificial verifica padrões de fraude, inconsistências e riscos em segundos.',
              },
              {
                step: '03',
                icon: <Shield className="w-8 h-8" />,
                title: 'Receba o Resultado',
                description: 'Obtenha um score de risco detalhado com recomendações claras e acionáveis.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 hover:border-[#F6C90E]/50 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#F6C90E] text-[#0D0D0D] rounded-xl flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-6 text-[#F6C90E] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Section */}
      <section className="py-24 px-4 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Por Que Confiar no Cuida-PIX?
            </h2>
            <p className="text-xl text-gray-400">
              Tecnologia de ponta para sua segurança
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Lock />, title: 'Criptografia Bancária', desc: 'Seus dados protegidos com o mesmo padrão de segurança dos bancos.' },
              { icon: <Zap />, title: 'Análise em 30 Segundos', desc: 'Resultados instantâneos sem comprometer a precisão.' },
              { icon: <Brain />, title: 'IA Proprietária', desc: 'Algoritmos exclusivos treinados com milhões de casos reais.' },
              { icon: <Eye />, title: 'Detecção Avançada', desc: 'Identifica padrões invisíveis ao olho humano.' },
              { icon: <Award />, title: 'Precisão de Elite', desc: 'Taxa de acerto superior a 98% em detecção de fraudes.' },
              { icon: <Users />, title: '+23 Milhões de Análises', desc: 'Confiança de milhares de usuários em todo o Brasil.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0D0D0D] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all group"
              >
                <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-4 text-[#F6C90E] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Tecnologias de IA Utilizadas
            </h2>
            <p className="text-xl text-gray-400">
              O que torna nossa análise tão precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Visão Computacional',
                desc: 'Análise pixel a pixel de comprovantes e QR Codes para detectar adulterações e inconsistências visuais.',
                tech: 'OpenAI GPT-4 Vision',
              },
              {
                title: 'Processamento de Linguagem Natural',
                desc: 'Identificação de linguagem urgente, ameaças e padrões de comunicação típicos de golpistas.',
                tech: 'NLP Avançado',
              },
              {
                title: 'Machine Learning',
                desc: 'Modelos treinados com milhões de casos reais de fraude para reconhecimento de padrões.',
                tech: 'Deep Learning',
              },
              {
                title: 'Análise de Metadados',
                desc: 'Verificação de domínios, links encurtados, chaves PIX e dados técnicos ocultos.',
                tech: 'Forensics Digital',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 hover:border-[#F6C90E]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <span className="px-3 py-1 bg-[#F6C90E]/10 text-[#F6C90E] text-xs font-semibold rounded-full">
                    {item.tech}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/technology">
              <Button variant="outline" size="lg" className="group">
                Saiba Mais Sobre Nossa Tecnologia
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              O Que Dizem Nossos Usuários
            </h2>
            <p className="text-xl text-gray-400">
              Histórias reais de proteção
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Maria Silva',
                role: 'Empreendedora',
                text: 'O Cuida-PIX me salvou de um golpe de R$ 15.000. A análise identificou inconsistências que eu não tinha percebido.',
                rating: 5,
              },
              {
                name: 'João Santos',
                role: 'Contador',
                text: 'Uso diariamente para validar comprovantes de clientes. A precisão é impressionante e me dá total segurança.',
                rating: 5,
              },
              {
                name: 'Ana Costa',
                role: 'Comerciante',
                text: 'Interface simples e resultados rápidos. Essencial para quem trabalha com PIX todos os dias.',
                rating: 5,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 hover:border-[#F6C90E]/50 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-[#F6C90E] text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{item.text}"</p>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#F6C90E] to-[#FFE347]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D0D0D] mb-6">
            Proteja-se Agora Contra Golpes de PIX
          </h2>
          <p className="text-xl text-[#0D0D0D]/80 mb-8">
            Junte-se a milhares de brasileiros que já confiam no Cuida-PIX
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <button className="px-8 py-4 bg-[#0D0D0D] text-white font-bold text-lg rounded-xl hover:bg-[#1A1A1A] transition-all shadow-2xl hover:scale-105">
                Ver Planos
              </button>
            </Link>
            <Link href="/analyze">
              <button className="px-8 py-4 bg-white text-[#0D0D0D] font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
                Começar Gratuitamente
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
