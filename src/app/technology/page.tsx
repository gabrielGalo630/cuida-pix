'use client';

import Link from 'next/link';
import { Shield, Brain, Eye, Lock, Zap, Server, Database, Code, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/custom/Button';
import { Footer } from '@/components/custom/Footer';

export default function TechnologyPage() {
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
              <Brain className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Tecnologia & IA</h1>
              <p className="text-gray-400 mt-1">Como protegemos você contra golpes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Hero Section */}
          <section className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#F6C90E]/30 rounded-full mb-8">
              <Shield className="w-4 h-4 text-[#F6C90E]" />
              <span className="text-sm font-semibold text-[#F6C90E]">Tecnologia Proprietária 2025™</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              IA de Última Geração para<br />
              <span className="bg-gradient-to-r from-[#F6C90E] to-[#FFE347] bg-clip-text text-transparent">
                Detecção de Fraudes
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Combinamos múltiplas tecnologias de inteligência artificial para oferecer a análise mais precisa e confiável do mercado.
            </p>
          </section>

          {/* Main Technologies */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Nossas Tecnologias</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Eye className="w-8 h-8" />,
                  title: 'Visão Computacional',
                  tech: 'OpenAI GPT-4 Vision',
                  description: 'Análise pixel a pixel de comprovantes e QR Codes para detectar adulterações, inconsistências visuais e padrões suspeitos.',
                  features: [
                    'Detecção de adulteração de imagens',
                    'Reconhecimento de logos e marcas falsas',
                    'Análise de qualidade e autenticidade',
                    'Verificação de formatação bancária',
                  ],
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: 'Processamento de Linguagem Natural',
                  tech: 'NLP Avançado',
                  description: 'Identificação de linguagem urgente, ameaças e padrões de comunicação típicos de golpistas através de análise semântica profunda.',
                  features: [
                    'Detecção de linguagem manipuladora',
                    'Análise de urgência artificial',
                    'Identificação de padrões de golpe',
                    'Verificação de contexto e coerência',
                  ],
                },
                {
                  icon: <Database className="w-8 h-8" />,
                  title: 'Machine Learning',
                  tech: 'Deep Learning',
                  description: 'Modelos treinados com milhões de casos reais de fraude para reconhecimento de padrões e predição de riscos.',
                  features: [
                    'Treinamento com 23M+ análises',
                    'Aprendizado contínuo',
                    'Reconhecimento de novos golpes',
                    'Precisão superior a 98%',
                  ],
                },
                {
                  icon: <Server className="w-8 h-8" />,
                  title: 'Análise de Metadados',
                  tech: 'Forensics Digital',
                  description: 'Verificação profunda de domínios, links encurtados, chaves PIX e dados técnicos ocultos em comprovantes.',
                  features: [
                    'Validação de domínios e URLs',
                    'Análise de links encurtados',
                    'Verificação de chaves PIX',
                    'Detecção de dados ocultos',
                  ],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8 hover:border-[#F6C90E]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center text-[#F6C90E]">
                      {item.icon}
                    </div>
                    <span className="px-3 py-1 bg-[#F6C90E]/10 text-[#F6C90E] text-xs font-semibold rounded-full">
                      {item.tech}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                  <ul className="space-y-3">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                        <CheckCircle className="w-5 h-5 text-[#F6C90E] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-[#1A1A1A] rounded-2xl p-12">
            <h3 className="text-3xl font-extrabold mb-12 text-center">Como a IA Lê o Comprovante</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Extração de Dados',
                  description: 'A IA extrai todos os dados visíveis e ocultos do comprovante: valores, datas, nomes, chaves PIX, metadados.',
                },
                {
                  step: '02',
                  title: 'Análise Cruzada',
                  description: 'Compara os dados extraídos com padrões conhecidos de fraude e verifica inconsistências entre informações.',
                },
                {
                  step: '03',
                  title: 'Score de Risco',
                  description: 'Gera um score de 0-100 baseado em múltiplos fatores e fornece recomendações claras de ação.',
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#F6C90E] text-[#0D0D0D] rounded-xl flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="bg-[#0D0D0D] rounded-xl p-8 pt-12">
                    <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-3xl font-extrabold mb-12 text-center">Segurança e Privacidade</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: 'Criptografia SSL',
                  description: 'Todos os dados são transmitidos com criptografia de nível bancário.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Zero Armazenamento',
                  description: 'Não armazenamos permanentemente seus comprovantes ou dados sensíveis.',
                },
                {
                  icon: <Code className="w-6 h-6" />,
                  title: 'Compliance Total',
                  description: 'Conformidade com LGPD e padrões internacionais de segurança.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all"
                >
                  <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-4 text-[#F6C90E]">
                    {item.icon}
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl p-12 text-[#0D0D0D]">
            <h3 className="text-3xl font-extrabold mb-12 text-center">Números que Impressionam</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '23M+', label: 'Análises Realizadas' },
                { value: '98%', label: 'Taxa de Precisão' },
                { value: '30s', label: 'Tempo Médio' },
                { value: '24/7', label: 'Disponibilidade' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-5xl font-extrabold mb-2">{stat.value}</p>
                  <p className="text-[#0D0D0D]/80 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
              Experimente Nossa Tecnologia
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Veja como nossa IA pode proteger você contra golpes em tempo real
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/analyze">
                <Button size="lg">
                  Analisar Comprovante Agora
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  Ver Planos
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
