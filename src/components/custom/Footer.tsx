import Link from 'next/link';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#F6C90E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#0D0D0D]" />
              </div>
              <span className="text-xl font-extrabold text-white">Cuida-PIX</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A IA Nº1 do Brasil para detectar golpes em PIX e QR Codes. Proteção avançada para seus pagamentos.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h3 className="text-white font-bold mb-4">Produto</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/technology" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Analisar Comprovante
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white font-bold mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-[#F6C90E] transition-colors text-sm">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#F6C90E]" />
                contato@cuidapix.com.br
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#F6C90E]" />
                (11) 9999-9999
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#F6C90E]" />
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F6C90E]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Cuida-PIX. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-[#F6C90E] transition-colors text-sm">
                Privacidade
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#F6C90E] transition-colors text-sm">
                Termos
              </Link>
              <Link href="/support" className="text-gray-500 hover:text-[#F6C90E] transition-colors text-sm">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
