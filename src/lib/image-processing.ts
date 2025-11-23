import jsQR from 'jsqr';
import Tesseract from 'tesseract.js';

export async function decodeQRCode(imageData: ImageData): Promise<string | null> {
  try {
    const code = jsQR(
      imageData.data,
      imageData.width,
      imageData.height,
      {
        inversionAttempts: 'dontInvert',
      }
    );

    return code?.data || null;
  } catch (error) {
    console.error('QR decode error:', error);
    return null;
  }
}

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageFile, 'por', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return result.data.text;
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
}

export async function processImage(file: File): Promise<{
  qrCode: string | null;
  ocrText: string;
  imageData: ImageData | null;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        // Create canvas to get ImageData
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ qrCode: null, ocrText: '', imageData: null });
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Try to decode QR code
        const qrCode = await decodeQRCode(imageData);

        // Extract text with OCR
        const ocrText = await extractTextFromImage(file);

        resolve({ qrCode, ocrText, imageData });
      };

      img.onerror = () => {
        resolve({ qrCode: null, ocrText: '', imageData: null });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({ qrCode: null, ocrText: '', imageData: null });
    };

    reader.readAsDataURL(file);
  });
}

export function maskSensitiveData(text: string): string {
  // Mask CPF (xxx.xxx.xxx-xx)
  text = text.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, (match) => {
    return `***.***.***-${match.slice(-2)}`;
  });

  // Mask CNPJ (xx.xxx.xxx/xxxx-xx)
  text = text.replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, (match) => {
    return `**.***.***/****-${match.slice(-2)}`;
  });

  // Mask phone numbers
  text = text.replace(/\(\d{2}\)\s?\d{4,5}-\d{4}/g, '(**) ****-****');

  // Mask email
  text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, (match) => {
    const [user, domain] = match.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
  });

  return text;
}

export function extractPixKey(text: string): string | null {
  // Try to extract PIX key patterns
  const patterns = [
    // Email
    /[\w.-]+@[\w.-]+\.\w+/,
    // Phone
    /\+?55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/,
    // CPF
    /\d{3}\.\d{3}\.\d{3}-\d{2}/,
    // CNPJ
    /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/,
    // Random key (UUID-like)
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  return null;
}

export function extractAmount(text: string): number | null {
  // Try to extract monetary values
  const patterns = [
    /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/,
    /(\d{1,3}(?:\.\d{3})*(?:,\d{2}))/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1].replace(/\./g, '').replace(',', '.');
      return parseFloat(value);
    }
  }

  return null;
}

export function extractFields(text: string): Record<string, any> {
  return {
    pixKey: extractPixKey(text),
    amount: extractAmount(text),
    hasUrgentLanguage: /urgente|rápido|agora|última chance/i.test(text),
    hasPromise: /reembolso|prêmio|ganhou|sorteio/i.test(text),
    hasThreat: /bloqueado|suspenso|cancelado/i.test(text),
    requestsData: /cpf|senha|cartão|dados pessoais/i.test(text),
  };
}
