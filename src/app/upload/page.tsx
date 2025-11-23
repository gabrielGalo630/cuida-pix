'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileImage, Link as LinkIcon, FileText, Loader2, AlertCircle } from 'lucide-react';
import { supabase, uploadFile, createVerification } from '@/lib/supabase';
import { processImage, extractFields, maskSensitiveData } from '@/lib/image-processing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/custom/navbar';

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'link' | 'text'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
    };

    checkUser();
  }, [router]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Por favor, envie apenas arquivos de imagem');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Por favor, envie apenas arquivos de imagem');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!consent) {
      setError('Você precisa concordar com os termos para continuar');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let type: 'pix' | 'qr' | 'link' | 'text' = 'text';
      let inputData: any = {};

      if (activeTab === 'image' && file) {
        // Process image
        const { qrCode, ocrText } = await processImage(file);
        
        // Upload file
        const filePath = await uploadFile(file, user.id);
        
        type = qrCode ? 'qr' : 'pix';
        inputData = {
          file_path: filePath,
          input_text: maskSensitiveData(ocrText || ''),
          metadata: {
            qr_code: qrCode,
            ocr_text: ocrText,
            extracted_fields: extractFields(ocrText || ''),
          },
        };
      } else if (activeTab === 'link') {
        if (!linkUrl) {
          setError('Por favor, insira um link');
          setLoading(false);
          return;
        }

        type = 'link';
        inputData = {
          input_url: linkUrl,
          metadata: {
            domain: new URL(linkUrl).hostname,
          },
        };
      } else if (activeTab === 'text') {
        if (!textInput) {
          setError('Por favor, insira um texto');
          setLoading(false);
          return;
        }

        type = 'text';
        inputData = {
          input_text: maskSensitiveData(textInput),
          metadata: {
            extracted_fields: extractFields(textInput),
          },
        };
      }

      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ...inputData,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar');
      }

      const result = await response.json();

      // Create verification record
      const verification = await createVerification({
        user_id: user.id,
        type,
        ...inputData,
        score: result.score,
        risk_level: result.risk_level,
        reasons: result.reasons,
        recommendations: result.recommendations,
        metadata: {
          ...inputData.metadata,
          ...result.metadata,
          confidence: result.confidence,
        },
      });

      // Redirect to result page
      router.push(`/result/${verification.id}`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Erro ao processar análise');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FFD200] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Nova Verificação
            </h1>
            <p className="text-gray-400">
              Analise comprovantes, QR Codes, links e textos em segundos
            </p>
          </div>

          <Card className="bg-gray-900 border-[#FFD200]/20">
            <CardHeader>
              <CardTitle>O que você deseja analisar?</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black">
                  <TabsTrigger value="image" className="data-[state=active]:bg-[#FFD200] data-[state=active]:text-black">
                    <FileImage className="w-4 h-4 mr-2" />
                    Imagem
                  </TabsTrigger>
                  <TabsTrigger value="link" className="data-[state=active]:bg-[#FFD200] data-[state=active]:text-black">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Link
                  </TabsTrigger>
                  <TabsTrigger value="text" className="data-[state=active]:bg-[#FFD200] data-[state=active]:text-black">
                    <FileText className="w-4 h-4 mr-2" />
                    Texto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="mt-6">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                      dragActive
                        ? 'border-[#FFD200] bg-[#FFD200]/5'
                        : 'border-gray-700 hover:border-[#FFD200]/50'
                    }`}
                  >
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    {file ? (
                      <div>
                        <p className="text-[#FFD200] font-semibold mb-2">{file.name}</p>
                        <p className="text-sm text-gray-400 mb-4">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setFile(null)}
                          className="border-[#FFD200]/20 text-[#FFD200]"
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-400 mb-2">
                          Arraste uma imagem aqui ou clique para selecionar
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          PNG, JPG, WEBP até 5MB
                        </p>
                        <label htmlFor="file-upload">
                          <Button
                            type="button"
                            className="bg-[#FFD200] text-black hover:bg-[#FFD200]/90"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Selecionar arquivo
                          </Button>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="link" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="link-input">Cole o link suspeito</Label>
                      <Input
                        id="link-input"
                        type="url"
                        placeholder="https://exemplo.com/pagamento"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="bg-black border-gray-700 focus:border-[#FFD200]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">Cole o texto da mensagem</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Cole aqui a mensagem suspeita que você recebeu..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={8}
                        className="bg-black border-gray-700 focus:border-[#FFD200]"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Consent Checkbox */}
              <div className="mt-6 p-4 bg-black/50 border border-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm text-gray-400 cursor-pointer">
                    Concordo em enviar meus dados para análise de segurança. A plataforma Cuida-PIX 
                    processa estas informações para detectar fraudes; dados sensíveis serão mascarados 
                    e a plataforma segue boas práticas de privacidade.
                  </Label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={loading || !consent || (activeTab === 'image' && !file) || (activeTab === 'link' && !linkUrl) || (activeTab === 'text' && !textInput)}
                className="w-full mt-6 bg-[#FFD200] text-black hover:bg-[#FFD200]/90 text-lg py-6 h-auto font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  'Analisar'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
