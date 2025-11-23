'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  if (!user) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#FFD200]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-[#FFD200]" />
              <span className="text-xl font-bold text-white">Cuida-PIX</span>
            </Link>
            <Link href="/login">
              <Button className="bg-[#FFD200] text-black hover:bg-[#FFD200]/90">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#FFD200]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#FFD200]" />
            <span className="text-xl font-bold text-white">Cuida-PIX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-[#FFD200]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className={`text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'text-[#FFD200]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Nova Verificação
            </Link>
            <Link
              href="/history"
              className={`text-sm font-medium transition-colors ${
                isActive('/history')
                  ? 'text-[#FFD200]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Histórico
            </Link>
            <Link
              href="/settings"
              className={`text-sm font-medium transition-colors ${
                isActive('/settings')
                  ? 'text-[#FFD200]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Configurações
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FFD200]/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-[#FFD200]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/upload')
                    ? 'text-[#FFD200]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Nova Verificação
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/history')
                    ? 'text-[#FFD200]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Histórico
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'text-[#FFD200]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Configurações
              </Link>
              <button
                onClick={handleSignOut}
                className="text-left text-sm font-medium text-gray-300 hover:text-white"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
