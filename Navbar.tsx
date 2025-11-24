'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-lg border-b border-[#F6C90E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-[#0D0D0D]" />
            </div>
            <span className="text-xl font-extrabold text-white">Cuida-PIX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/technology" className="text-gray-300 hover:text-[#F6C90E] transition-colors font-medium">
              Tecnologia
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-[#F6C90E] transition-colors font-medium">
              Sobre Nós
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-[#F6C90E] transition-colors font-medium">
              Planos
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-[#F6C90E] transition-colors font-medium">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#2A2A2A] transition-all border border-[#F6C90E]/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-[#F6C90E] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#F6C90E]/10">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/technology"
              className="block text-gray-300 hover:text-[#F6C90E] transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tecnologia
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-[#F6C90E] transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre Nós
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-300 hover:text-[#F6C90E] transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planos
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-300 hover:text-[#F6C90E] transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-5 py-3 bg-[#2A2A2A] text-white rounded-xl hover:bg-[#3A3A3A] transition-all border border-[#F6C90E]/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
