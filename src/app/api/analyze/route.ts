import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithOpenAI, getRiskLevel, type AnalysisInput } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user using public client
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, input_text, input_url, file_path, metadata } = body;

    if (!type || !['pix', 'qr', 'link', 'text'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    // Build analysis input
    const analysisInput: AnalysisInput = {
      type,
      raw_text: input_text,
      link_url: input_url,
      ...metadata,
    };

    // Analyze with OpenAI
    const result = await analyzeWithOpenAI(analysisInput);

    // Determine risk level
    const risk_level = getRiskLevel(result.score);

    // Return result
    return NextResponse.json({
      score: result.score,
      risk_level,
      reasons: result.reasons,
      recommendations: result.recommendations,
      metadata: result.metadata,
      confidence: result.confidence,
    });

  } catch (error: any) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
