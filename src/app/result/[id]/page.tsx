'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Plus } from 'lucide-react';
import { supabase, getVerification, type Verification } from '@/lib/supabase';
import { getRiskColor, getRiskLabel } from '@/lib/openai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/custom/navbar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      await loadVerification();
    };

    checkUserAndLoad();
  }, [id, router]);

  const loadVerification = async () => {
    try {
      setLoading(true);
      const data = await getVerification(id);
      
      if (!data) {
        setError('Verificação não encontrada');
        return;
      }

      setVerification(data);
    } catch (err: any) {
      console.error('Error loading verification:', err);
      setError(err.message || 'Erro ao carregar verificação');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[#FFD200] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{error || 'Verificação não encontrada'}</p>
          <Link href="/dashboard">
            <Button className="bg-[#FFD200] text-black hover:bg-[#FFD200]/90">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const riskColor = getRiskColor(verification.risk_level);
  const riskLabel = getRiskLabel(verification.risk_level);

  const getRiskIcon = () => {
    switch (verification.risk_level) {
      case 'safe':
        return <CheckCircle className="w-16 h-16" style={{ color: riskColor }} />;
      case 'attention':
        return <AlertTriangle className="w-16 h-16" style={{ color: riskColor }} />;
      case 'high_risk':
        return <XCircle className="w-16 h-16" style={{ color: riskColor }} />;
      default:
        return <Shield className="w-16 h-16" style={{ color: riskColor }} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Link>

          {/* Score Card */}
          <Card className="bg-gray-900 border-[#FFD200]/20 mb-6">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getRiskIcon()}
                </div>
                
                <div className="mb-6">
                  <div className="text-6xl font-bold mb-2" style={{ color: riskColor }}>
                    {verification.score}
                  </div>
                  <div className="text-2xl font-semibold mb-2" style={{ color: riskColor }}>
                    {riskLabel}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Score: {verification.score}/100 — {riskLabel}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="uppercase">{verification.type}</span>
                  <span>•</span>
                  <span>{format(new Date(verification.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reasons Card */}
          <Card className="bg-gray-900 border-[#FFD200]/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FFD200]" />
                Motivos da Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verification.reasons.length > 0 ? (
                <ul className="space-y-3">
                  {verification.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FFD200]/10 text-[#FFD200] flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-gray-300">{reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhum motivo específico identificado.</p>
              )}
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="bg-gray-900 border-[#FFD200]/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FFD200]" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verification.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {verification.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#FFD200] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Nenhuma recomendação específica.</p>
              )}
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 text-center">
              Cuida-PIX não é um órgão oficial. As análises são recomendações automatizadas
              e não substituem investigação policial. Em caso de suspeita de golpe,
              denuncie às autoridades competentes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/upload" className="flex-1">
              <Button className="w-full bg-[#FFD200] text-black hover:bg-[#FFD200]/90 text-lg py-6 h-auto font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Verificar outro
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button variant="outline" className="w-full border-[#FFD200]/20 text-[#FFD200] hover:bg-[#FFD200]/10 text-lg py-6 h-auto">
                Ver histórico
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
