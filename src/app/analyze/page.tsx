'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Shield, Upload, FileText, Image as ImageIcon, Link2, ArrowLeft, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/custom/Button';

export default function AnalyzePage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Tipo de arquivo não suportado. Use PNG, JPG, JPEG ou PDF.');
      return;
    }

    // Validar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB em bytes
    if (selectedFile.size > maxSize) {
      alert('Arquivo muito grande. O tamanho máximo é 10MB.');
      return;
    }

    setFile(selectedFile);
    
    // Criar preview apenas para imagens
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Para PDFs, mostrar ícone
      setPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulação de análise (substituir por chamada real à API)
    setTimeout(() => {
      setResult({
        score: 85,
        risk_level: 'safe',
        confidence: 92,
        reasons: [
          'Comprovante possui formatação padrão do banco',
          'Dados do destinatário verificados',
          'Sem sinais de adulteração detectados',
        ],
        recommendations: [
          'Comprovante aprovado para uso',
          'Dados consistentes com padrões bancários',
          'Recomendamos prosseguir com a transação',
        ],
      });
      setAnalyzing(false);
    }, 3000);
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'safe': return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'attention': return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'high_risk': return <XCircle className="w-16 h-16 text-red-500" />;
      default: return <Shield className="w-16 h-16 text-gray-500" />;
    }
  };

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

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-[#F6C90E]/10 px-4 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F6C90E] transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar ao Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Análise de Comprovante</h1>
              <p className="text-gray-400 mt-1">Proteção avançada contra golpes em PIX</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {!result ? (
            <div className="space-y-8">
              {/* Upload Area */}
              <div 
                className={`bg-[#1A1A1A] border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                  ${isDragging 
                    ? 'border-[#F6C90E] bg-[#F6C90E]/5' 
                    : 'border-[#F6C90E]/30 hover:border-[#F6C90E]/60'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-[#F6C90E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-[#F6C90E]" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Envie seu Comprovante</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Arraste e solte ou clique para selecionar uma imagem, PDF ou captura de tela
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/png,image/jpg,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                />
                <Button 
                  size="lg" 
                  className="pointer-events-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  Selecionar Arquivo
                </Button>
              </div>

              {/* Preview */}
              {file && (
                <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6">Preview do Comprovante</h3>
                  <div className="bg-[#0D0D0D] rounded-xl p-4 mb-6">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg mx-auto"
                        style={{ maxHeight: '400px' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <FileText className="w-20 h-20 text-[#F6C90E] mb-4" />
                        <p className="text-gray-400">Arquivo PDF selecionado</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#F6C90E]" />
                      <span className="text-sm text-gray-400">{file?.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {analyzing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analisando...
                        </>
                      ) : (
                        'Iniciar Análise'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all">
                  <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-4">
                    <ImageIcon className="w-6 h-6 text-[#F6C90E]" />
                  </div>
                  <h3 className="font-bold mb-2">Imagem</h3>
                  <p className="text-sm text-gray-400">PNG, JPG, JPEG até 10MB</p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all">
                  <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-[#F6C90E]" />
                  </div>
                  <h3 className="font-bold mb-2">PDF</h3>
                  <p className="text-sm text-gray-400">Documentos até 10MB</p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-6 hover:border-[#F6C90E]/50 transition-all">
                  <div className="w-12 h-12 bg-[#F6C90E]/10 rounded-xl flex items-center justify-center mb-4">
                    <Link2 className="w-6 h-6 text-[#F6C90E]" />
                  </div>
                  <h3 className="font-bold mb-2">Captura de Tela</h3>
                  <p className="text-sm text-gray-400">Screenshots até 10MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Result Header */}
              <div className="bg-gradient-to-br from-[#F6C90E] to-[#FFE347] rounded-2xl p-8 text-[#0D0D0D] text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl md:text-3xl font-extrabold">Análise Concluída</h2>
                </div>
                <p className="text-lg opacity-90">IA Anti-Fraude 2025™</p>
              </div>

              {/* Score Card */}
              <div className="bg-[#1A1A1A] border border-[#F6C90E]/20 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    {getRiskIcon(result.risk_level)}
                  </div>
                  <h3 className="text-4xl font-extrabold mb-2" style={{ color: getRiskColor(result.risk_level) }}>
                    {getRiskLabel(result.risk_level)}
                  </h3>
                  <p className="text-gray-400">Nível de Risco Detectado</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#0D0D0D] rounded-xl p-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">Score de Confiabilidade</p>
                    <p className="text-5xl font-extrabold" style={{ color: getRiskColor(result.risk_level) }}>
                      {result.score}
                    </p>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-xl p-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">Confiança da IA</p>
                    <p className="text-5xl font-extrabold text-[#F6C90E]">
                      {result.confidence}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Análise de Risco</span>
                    <span className="text-sm font-bold" style={{ color: getRiskColor(result.risk_level) }}>
                      {result.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#0D0D0D] rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${result.score}%`,
                        backgroundColor: getRiskColor(result.risk_level),
                      }}
                    />
                  </div>
                </div>

                {/* Reasons */}
                <div className="mb-8">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#F6C90E]" />
                    Motivos da Análise
                  </h4>
                  <ul className="space-y-3">
                    {result.reasons.map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-[#F6C90E] flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-[#0D0D0D] rounded-xl p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F6C90E]" />
                    Recomendações
                  </h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <div className="w-6 h-6 bg-[#F6C90E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#F6C90E]">{i + 1}</span>
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setPreview(null);
                  }}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Nova Análise
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button size="lg" className="w-full">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
