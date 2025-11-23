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
      // opcional: valida tamanho aqui também (ex: <= 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('O arquivo deve ter no máximo 5MB');
      }

      const { qrCode, ocrText } = await processImage(file);

      const filePath = await uploadFile(file, user.id);
      if (!filePath) throw new Error('Falha ao enviar o arquivo');

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
        throw new Error('Por favor, insira um link');
      }
      // valida URL
      let hostname = '';
      try {
        const u = new URL(linkUrl);
        hostname = u.hostname;
      } catch (_err) {
        throw new Error('URL inválida');
      }

      type = 'link';
      inputData = {
        input_url: linkUrl,
        metadata: {
          domain: hostname,
        },
      };
    } else if (activeTab === 'text') {
      if (!textInput) {
        throw new Error('Por favor, insira um texto');
      }

      type = 'text';
      inputData = {
        input_text: maskSensitiveData(textInput),
        metadata: {
          extracted_fields: extractFields(textInput),
        },
      };
    } else {
      throw new Error('Nenhuma entrada válida encontrada');
    }

    // Chama a API de análise
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...inputData }),
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => null);
      console.error('analyze non-ok response:', response.status, txt);
      throw new Error('Erro ao analisar (serviço de análise retornou erro)');
    }

    const result = await response.json();

    // Cria registro no banco
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

    // checar retorno do createVerification
    const verificationId = verification?.id || verification?.data?.id || verification?.insertedId;
    if (!verificationId) {
      console.warn('createVerification retorno inesperado:', verification);
      throw new Error('Verificação criada, mas não foi possível obter o ID do registro');
    }

    // Redireciona para resultados
    router.push(`/result/${verificationId}`);
  } catch (err: any) {
    console.error('Analysis error:', err);
    setError(err?.message || 'Erro ao processar análise');
  } finally {
    setLoading(false);
  }
};
