'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { supabase, getVerifications, type Verification } from '@/lib/supabase';
import { getRiskColor, getRiskLabel } from '@/lib/openai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/custom/navbar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    attention: 0,
    highRisk: 0,
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        setLoadError('');

        // Verifica sessão do Supabase de forma segura
        const sessionResp = await supabase.auth.getSession();
        if (!sessionResp || !sessionResp.data || !sessionResp.data.session) {
          // tentativa adicional de obter user (compatibilidade com versões)
          const userResp = await supabase.auth.getUser?.();
          const maybeUser = userResp?.data?.user ?? null;
          if (!maybeUser) {
            // não autenticado -> redireciona para login
            router.push('/login');
            return;
          }
          setUser(maybeUser);
          await loadVerifications(maybeUser.id);
          return;
        }

        const currentUser = sessionResp.data.session.user;
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);
        await loadVerifications(currentUser.id);
      } catch (err: any) {
        console.error('[Dashboard] error checking user/session:', err);
        setLoadError('Erro ao verificar sessão do usuário. Por favor, faça login novamente.');
        // redireciona para login por segurança
        try { router.push('/login'); } catch(e) { /* ignore */ }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Função segura para carregar verificações
  const loadVerifications = async (userId: string, limit = 10) => {
    try {
      setLoading(true);
      setLoadError('');

      if (!userId) {
        console.warn('[Dashboard] loadVerifications chamado sem userId');
        setVerifications([]);
        setLoading(false);
        setLoadError('Usuário não autenticado.');
        return;
      }

      // Chama helper que está no lib/supabase (getVerifications)
      const data = await getVerifications(userId, limit);

      // Validations: garante array
      const arr = Array.isArray(data) ? data : [];
      setVerifications(arr);

      // Calculate stats
      const total = arr.length;
      const safe = arr.filter(v => v.risk_level === 'safe').length;
      const attention = arr.filter(v => v.risk_level === 'attention').length;
      const highRisk = arr.filter(v => v.risk_level === 'high_risk').length;

      setStats({ total, safe, attention, highRisk });
    } catch (error: any) {
      // Logging detalhado para diagnosticar
      console.error('[Dashboard] Error loading verifications:', error, 'string:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      setVerifications([]);
      setLoadError('Falha ao carregar verificações. Verifique logs (console) para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Retry handler (útil para o usuário tentar novamente)
  const handleRetry = async () => {
    if (!user?.id) {
      setLoadError('Usuário não autenticado. Faça login.');
      return;
    }
    await loadVerifications(user.id, 20);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[#FFD200] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Bem-vindo de volta, {user?.email ? user.email.split('@')[0] : 'usuário'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-[#FFD200]/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total de Verificações
                </CardTitle>
                <Shield className="w-4 h-4 text-[#FFD200]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Seguros
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.safe}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Atenção
                </CardTitle>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{stats.attention}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Alto Risco
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.highRisk}</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Link href="/upload">
              <Button className="w-full sm:w-auto bg-[#FFD200] text-black hover:bg-[#FFD200]/90 text-lg px-8 py-6 h-auto font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Fazer nova verificação
              </Button>
            </Link>
          </div>

          {/* Load error display */}
          {loadError && (
            <div className="mb-6 p-4 rounded-md bg-red-900/40 border border-red-700 text-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="block">Erro ao carregar verificações</strong>
                  <p className="text-sm text-red-200">{loadError}</p>
                </div>
                <div>
                  <Button onClick={handleRetry} className="bg-[#FFD200] text-black">Tentar novamente</Button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Verifications */}
          <Card className="bg-gray-900 border-[#FFD200]/20">
            <CardHeader>
              <CardTitle>Verificações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {verifications.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Ainda não há verificações — faça sua primeira análise.
                  </p>
                  <Link href="/upload">
                    <Button className="bg-[#FFD200] text-black hover:bg-[#FFD200]/90">
                      Começar agora
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {verifications.map((verification) => (
                    <Link
                      key={verification.id}
                      href={`/result/${verification.id}`}
                      className="block"
                    >
                      <div className="bg-black/50 border border-gray-800 rounded-lg p-4 hover:border-[#FFD200]/40 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: `${getRiskColor(verification.risk_level)}20`,
                                  color: getRiskColor(verification.risk_level),
                                }}
                              >
                                {getRiskLabel(verification.risk_level)}
                              </span>
                              <span className="text-xs text-gray-500 uppercase">
                                {verification.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {Array.isArray(verification.reasons) ? verification.reasons[0] : 'Análise concluída'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold mb-1" style={{ color: getRiskColor(verification.risk_level) }}>
                              {verification.score}
                            </div>
                            <p className="text-xs text-gray-500">
                              {verification.created_at ? format(new Date(verification.created_at), 'dd/MM/yyyy', { locale: ptBR }) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <Link href="/history">
                    <Button variant="outline" className="w-full border-[#FFD200]/20 text-[#FFD200] hover:bg-[#FFD200]/10">
                      Ver histórico completo
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
