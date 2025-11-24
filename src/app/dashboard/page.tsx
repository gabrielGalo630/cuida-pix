'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  LayoutDashboard,
  FileSearch,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Verification {
  id: string;
  user_id: string;
  type: string;
  score: number;
  risk_level: string;
  reasons: string[];
  recommendations: string[];
  created_at: string;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'safe': return '#10B981';
    case 'attention': return '#F59E0B';
    case 'high_risk': return '#EF4444';
    default: return '#6B7280';
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case 'safe': return 'Seguro';
    case 'attention': return 'Atenção';
    case 'high_risk': return 'Alto Risco';
    default: return 'Desconhecido';
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    attention: 0,
    highRisk: 0,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      await loadVerifications(user.id);
    };

    checkUser();
  }, [router]);

  const loadVerifications = async (userId: string) => {
    try {
      setLoading(true);
      
      // Criar AbortController com timeout de 1 segundo
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      try {
        const { data, error } = await supabase
          .from('verifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (error) {
          // Silenciosamente retorna array vazio sem console.error
          setVerifications([]);
          return;
        }

        setVerifications(data || []);

        const total = (data || []).length;
        const safe = (data || []).filter(v => v.risk_level === 'safe').length;
        const attention = (data || []).filter(v => v.risk_level === 'attention').length;
        const highRisk = (data || []).filter(v => v.risk_level === 'high_risk').length;

        setStats({ total, safe, attention, highRisk });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        // Silenciosamente retorna array vazio - não mostra erro no console
        // Trata tanto erro de rede quanto timeout/abort
        setVerifications([]);
        setStats({ total: 0, safe: 0, attention: 0, highRisk: 0 });
      }
    } catch (error) {
      // Catch externo para qualquer erro inesperado - silencioso
      setVerifications([]);
      setStats({ total: 0, safe: 0, attention: 0, highRisk: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[#F6C90E] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1A1A1A] border-r border-[#F6C90E]/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#F6C90E]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0D0D0D]" />
                </div>
                <span className="text-xl font-extrabold">Cuida-PIX</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-[#F6C90E]/10 text-[#F6C90E] rounded-xl font-semibold"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/analyze"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#0D0D0D] rounded-xl transition-all"
            >
              <FileSearch className="w-5 h-5" />
              Análises
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#0D0D0D] rounded-xl transition-all"
            >
              <History className="w-5 h-5" />
              Histórico
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#0D0D0D] rounded-xl transition-all"
            >
              <Settings className="w-5 h-5" />
              Configurações
            </Link>
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-[#F6C90E]/10">
            <div className="mb-3 px-4 py-3 bg-[#0D0D0D] rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Logado como</p>
              <p className="text-sm font-semibold truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur-lg border-b border-[#F6C90E]/10 px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Bem-vindo de volta, {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            <Link href="/analyze">
              <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F6C90E] to-[#FFE347] text-[#0D0D0D] font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                <Plus className="w-5 h-5" />
                Nova Análise
              </button>
            </Link>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#F6C90E]" />
                </div>
                <Sparkles className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total de Verificações</p>
              <p className="text-3xl font-extrabold">{stats.total}</p>
            </div>

            <div className="bg-[#1A1A1A] border border-green-500/20 rounded-2xl p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Seguros</p>
              <p className="text-3xl font-extrabold text-green-500">{stats.safe}</p>
            </div>

            <div className="bg-[#1A1A1A] border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Atenção</p>
              <p className="text-3xl font-extrabold text-yellow-500">{stats.attention}</p>
            </div>

            <div className="bg-[#1A1A1A] border border-red-500/20 rounded-2xl p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Alto Risco</p>
              <p className="text-3xl font-extrabold text-red-500">{stats.highRisk}</p>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl p-8 text-[#0D0D0D]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                  Analisar Comprovante Agora
                </h2>
                <p className="text-[#0D0D0D]/80 text-lg">
                  Proteja-se contra golpes em segundos com nossa IA avançada
                </p>
              </div>
              <Link href="/analyze">
                <button className="px-8 py-4 bg-[#0D0D0D] text-white font-bold rounded-xl hover:bg-[#1A1A1A] transition-all shadow-2xl hover:scale-105 whitespace-nowrap">
                  Começar Análise
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-extrabold mb-6">Verificações Recentes</h2>
            
            {verifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#F6C90E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-[#F6C90E]" />
                </div>
                <p className="text-gray-400 text-lg mb-2">
                  Nenhuma verificação encontrada ainda.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Faça sua primeira análise para começar.
                </p>
                <Link href="/analyze">
                  <button className="px-8 py-4 bg-gradient-to-r from-[#F6C90E] to-[#FFE347] text-[#0D0D0D] font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Começar Agora
                  </button>
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
                    <div className="bg-[#0D0D0D] border border-[#F6C90E]/10 rounded-xl p-6 hover:border-[#F6C90E]/40 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className="px-4 py-1.5 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${getRiskColor(verification.risk_level)}20`,
                                color: getRiskColor(verification.risk_level),
                              }}
                            >
                              {getRiskLabel(verification.risk_level)}
                            </span>
                            <span className="text-xs text-gray-500 uppercase font-semibold">
                              {verification.type}
                            </span>
                          </div>
                          <p className="text-gray-400 line-clamp-2 leading-relaxed">
                            {verification.reasons[0] || 'Análise concluída'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-extrabold mb-1" style={{ color: getRiskColor(verification.risk_level) }}>
                            {verification.score}
                          </div>
                          <p className="text-xs text-gray-500">
                            {format(new Date(verification.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                <Link href="/history">
                  <button className="w-full mt-6 px-6 py-3 bg-[#0D0D0D] border border-[#F6C90E]/20 text-[#F6C90E] rounded-xl hover:bg-[#F6C90E]/10 hover:border-[#F6C90E]/50 transition-all font-semibold">
                    Ver Histórico Completo
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
