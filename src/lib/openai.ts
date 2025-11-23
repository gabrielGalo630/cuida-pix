import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface AnalysisInput {
  type: 'pix' | 'qr' | 'link' | 'text';
  raw_text?: string;
  ocr_text?: string;
  qr_text?: string;
  link_url?: string;
  extracted_fields?: Record<string, any>;
  image_description?: string;
}

export interface AnalysisResult {
  score: number;
  reasons: string[];
  recommendations: string[];
  metadata: Record<string, any>;
  confidence: number;
}

const FRAUD_DETECTION_SYSTEM_PROMPT = `Você é um especialista em fraudes financeiras e segurança de pagamentos PIX no Brasil.

Analise os dados fornecidos e retorne um JSON com as seguintes chaves:
- score (0-100): pontuação de risco, onde 0 é seguro e 100 é golpe confirmado
- reasons (array de strings): explicações curtas e claras dos sinais de fraude detectados
- recommendations (array de strings): ações práticas que o usuário deve tomar
- metadata (objeto): detalhes técnicos da análise
- confidence (0-1): nível de confiança na análise

CRITÉRIOS DE AVALIAÇÃO (pesos sugeridos):
- Domínio de link não confiável ou encurtado: +30 pontos
- Erros graves de português ou formatação: +10 pontos
- Linguagem urgente, ameaças ou pressão: +20 pontos
- Promessa de reembolso, prêmio ou dinheiro fácil: +15 pontos
- Chave PIX com formato suspeito ou inconsistente: +25 pontos
- QR Code com domínio encurtado ou desconhecido: +20 pontos
- Nome/CPF/CNPJ incompatível com contexto: +20 pontos
- Conta PF (pessoa física) em nome de empresa: +15 pontos
- Valor muito alto ou inconsistente: +10 pontos
- Solicitação de dados pessoais sensíveis: +25 pontos
- Falta de informações básicas do beneficiário: +15 pontos

FORMATO DE RESPOSTA (JSON válido):
{
  "score": 85,
  "reasons": [
    "Link encurtado detectado (bit.ly) - comum em golpes",
    "Linguagem urgente: 'Pague agora ou perderá o benefício'",
    "Promessa de reembolso de R$ 5.000 sem justificativa"
  ],
  "recommendations": [
    "NÃO efetue o pagamento",
    "Bloqueie o contato que enviou esta mensagem",
    "Denuncie ao Banco Central através do canal oficial",
    "Verifique diretamente com a instituição pelos canais oficiais"
  ],
  "metadata": {
    "detected_patterns": ["urgency", "shortened_url", "unrealistic_promise"],
    "risk_factors": 3,
    "analysis_type": "link"
  },
  "confidence": 0.92
}

Seja preciso, claro e objetivo. Priorize a segurança do usuário.`;

export async function analyzeWithOpenAI(input: AnalysisInput): Promise<AnalysisResult> {
  try {
    const userPrompt = buildUserPrompt(input);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: FRAUD_DETECTION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const result = JSON.parse(content) as AnalysisResult;

    // Validate and sanitize result
    return {
      score: Math.min(100, Math.max(0, result.score || 0)),
      reasons: Array.isArray(result.reasons) ? result.reasons : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      metadata: result.metadata || {},
      confidence: Math.min(1, Math.max(0, result.confidence || 0.5))
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    
    // Fallback to heuristic analysis
    return fallbackAnalysis(input);
  }
}

function buildUserPrompt(input: AnalysisInput): string {
  const parts: string[] = [
    `Tipo de análise: ${input.type}`,
  ];

  if (input.raw_text) {
    parts.push(`Texto bruto: ${input.raw_text}`);
  }

  if (input.ocr_text) {
    parts.push(`Texto extraído (OCR): ${input.ocr_text}`);
  }

  if (input.qr_text) {
    parts.push(`Conteúdo do QR Code: ${input.qr_text}`);
  }

  if (input.link_url) {
    parts.push(`URL do link: ${input.link_url}`);
  }

  if (input.extracted_fields) {
    parts.push(`Campos extraídos: ${JSON.stringify(input.extracted_fields, null, 2)}`);
  }

  if (input.image_description) {
    parts.push(`Descrição da imagem: ${input.image_description}`);
  }

  return parts.join('\n\n');
}

function fallbackAnalysis(input: AnalysisInput): AnalysisResult {
  let score = 0;
  const reasons: string[] = [];
  const recommendations: string[] = [];
  const metadata: Record<string, any> = { fallback: true };

  const text = [
    input.raw_text,
    input.ocr_text,
    input.qr_text,
    input.link_url
  ].filter(Boolean).join(' ').toLowerCase();

  // Heuristic rules
  const suspiciousPatterns = [
    { pattern: /bit\.ly|tinyurl|encurtador/i, score: 30, reason: 'Link encurtado detectado' },
    { pattern: /urgente|rápido|agora|última chance/i, score: 20, reason: 'Linguagem urgente detectada' },
    { pattern: /reembolso|prêmio|ganhou|sorteio/i, score: 15, reason: 'Promessa de benefício suspeita' },
    { pattern: /bloqueado|suspenso|cancelado/i, score: 20, reason: 'Ameaça de bloqueio/suspensão' },
    { pattern: /clique aqui|acesse|confirme seus dados/i, score: 15, reason: 'Solicitação de ação imediata' },
    { pattern: /cpf|senha|cartão|dados pessoais/i, score: 25, reason: 'Solicitação de dados sensíveis' },
  ];

  for (const { pattern, score: points, reason } of suspiciousPatterns) {
    if (pattern.test(text)) {
      score += points;
      reasons.push(reason);
    }
  }

  // URL analysis
  if (input.link_url) {
    try {
      const url = new URL(input.link_url);
      const suspiciousDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
      
      if (suspiciousDomains.some(d => url.hostname.includes(d))) {
        score += 30;
        reasons.push('Domínio de link encurtado detectado');
      }

      if (!url.protocol.startsWith('https')) {
        score += 10;
        reasons.push('Link sem HTTPS (não seguro)');
      }
    } catch (e) {
      score += 20;
      reasons.push('URL inválida ou malformada');
    }
  }

  // Generate recommendations based on score
  if (score >= 70) {
    recommendations.push('NÃO efetue o pagamento - alto risco de golpe');
    recommendations.push('Bloqueie o contato imediatamente');
    recommendations.push('Denuncie ao Banco Central');
  } else if (score >= 40) {
    recommendations.push('Verifique a autenticidade antes de prosseguir');
    recommendations.push('Entre em contato com a instituição pelos canais oficiais');
    recommendations.push('Não forneça dados pessoais');
  } else {
    recommendations.push('Parece seguro, mas sempre verifique a origem');
    recommendations.push('Confirme os dados do beneficiário');
  }

  return {
    score: Math.min(100, score),
    reasons: reasons.length > 0 ? reasons : ['Análise heurística aplicada'],
    recommendations,
    metadata,
    confidence: 0.6
  };
}

export function getRiskLevel(score: number): 'safe' | 'attention' | 'high_risk' {
  if (score <= 40) return 'safe';
  if (score <= 70) return 'attention';
  return 'high_risk';
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'safe': return '#10B981'; // green
    case 'attention': return '#FFD200'; // yellow
    case 'high_risk': return '#EF4444'; // red
    default: return '#6B7280'; // gray
  }
}

export function getRiskLabel(riskLevel: string): string {
  switch (riskLevel) {
    case 'safe': return 'Seguro';
    case 'attention': return 'Atenção';
    case 'high_risk': return 'Alto Risco';
    default: return 'Desconhecido';
  }
}
