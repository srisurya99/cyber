import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { analyzePhishing } from './src/services/ai/phishingEngine.js';
import { analyzeMedia } from './src/services/ai/mediaForensics.js';
import { analyzeScam } from './src/services/ai/scamEngine.js';
import { analyzeBlackmail } from './src/services/ai/blackmailEngine.js';
import { inspectThreatIntelligence } from './src/services/ai/threatIntelligence.js';
import { analyzeApkPackage } from './src/services/ai/apkEngine.js';
import { analyzeDigitalArrestIncident } from './src/services/ai/digitalArrestEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini if API key is provided
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI({});
} catch (err) {
  console.warn('Could not initialize GoogleGenAI client, using heuristic fallback', err);
}

// 1. Phishing Analysis API
app.post('/api/analyze/phishing', async (req: Request, res: Response) => {
  try {
    const { type, content, sender, subject } = req.body;
    if (!content && !sender && !subject) {
      return res.status(400).json({ error: 'Content, sender, or subject is required' });
    }

    // Comprehensive domain intelligence + linguistic heuristic + calibrated contextual AI
    const result = await analyzePhishing(
      { type: type || 'message', content: content || '', sender, subject },
      aiClient
    );

    return res.json(result);
  } catch (error: any) {
    console.error('Phishing analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze phishing content' });
  }
});

// 2. Media Forensics API
app.post('/api/analyze/media', async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, fileSize, mediaType, fileDataUrl, keyFrames, videoDurationSec, videoResolution, samplingRate, isSimulated } = req.body;
    const result = await analyzeMedia(
      {
        fileName: fileName || 'uploaded_file',
        fileType: fileType || 'image/jpeg',
        fileSize: fileSize || 1024 * 1024,
        mediaType: mediaType || 'image',
        fileDataUrl,
        keyFrames,
        videoDurationSec,
        videoResolution,
        samplingRate,
        isSimulated,
      },
      aiClient
    );
    return res.json(result);
  } catch (error: any) {
    console.error('Media analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze media' });
  }
});

// 3. Scam Incident Response API
app.post('/api/analyze/scam', async (req: Request, res: Response) => {
  try {
    const result = await analyzeScam(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Scam analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze scam incident' });
  }
});

// 4. Blackmail Emergency Response API
app.post('/api/analyze/blackmail', async (req: Request, res: Response) => {
  try {
    const result = await analyzeBlackmail(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Blackmail analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze blackmail emergency' });
  }
});

// 5. Threat Intelligence Live Lookup API
app.post('/api/threat-intel/lookup', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Target URL is required' });
    }
    const result = await inspectThreatIntelligence(url);
    return res.json(result);
  } catch (error: any) {
    console.error('Threat intelligence lookup error:', error);
    return res.status(500).json({ error: 'Failed to complete threat intelligence lookup' });
  }
});

// 6. Malicious Application & APK Inspector API
app.post('/api/analyze/apk', async (req: Request, res: Response) => {
  try {
    const result = analyzeApkPackage(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('APK analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze APK package' });
  }
});

// 7. Digital Arrest & Sovereign Agency Impersonation Crisis API
app.post('/api/analyze/digital-arrest', async (req: Request, res: Response) => {
  try {
    const result = analyzeDigitalArrestIncident(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Digital arrest analysis error:', error);
    return res.status(500).json({ error: 'Failed to process digital arrest crisis report' });
  }
});

// 8. Universal AI Assistant API ("Ask ThreatLens")
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lower = message.toLowerCase();

    // Intent routing detection
    let route = '/check';
    let suggestedAction = { label: 'Check a Link or Message', route: '/check?tab=phishing' };

    if (lower.includes('photo') || lower.includes('video') || lower.includes('deepfake') || lower.includes('image') || lower.includes('face') || lower.includes('voice')) {
      suggestedAction = { label: 'Check Media Forensics', route: '/check?tab=media' };
    } else if (lower.includes('threat') || lower.includes('blackmail') || lower.includes('extort') || lower.includes('private') || lower.includes('leak') || lower.includes('kill') || lower.includes('harm')) {
      suggestedAction = { label: 'Emergency Blackmail Response', route: '/check?tab=blackmail' };
    } else if (lower.includes('money') || lower.includes('upi') || lower.includes('scam') || lower.includes('transferred') || lower.includes('lost') || lower.includes('fraud') || lower.includes('invest') || lower.includes('job')) {
      suggestedAction = { label: 'Scam Incident Response', route: '/check?tab=scam' };
    } else {
      suggestedAction = { label: 'Check Link or Message', route: '/check?tab=phishing' };
    }

    if (aiClient) {
      try {
        const prompt = `You are "Ask ThreatLens", a calm, supportive, citizen-friendly cyber safety guide.
User message: "${message.slice(0, 500)}"

Instructions:
1. Speak calmly, reassuringly, and simply to an ordinary person with zero technical knowledge.
2. Emphasize that they should not panic.
3. Recommend the specific ThreatLens tool they should use (${suggestedAction.label}).
4. Never pretend to be police, bank officials, or lawyers.
5. Keep your response within 2-3 concise paragraphs.`;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI chat inference timeout')), 4000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);

        const reply = response.text?.trim() || '';
        if (reply) {
          return res.json({
            reply,
            suggestedAction,
          });
        }
      } catch (err) {
        console.warn('Gemini chat failed, using fallback rule engine', err);
      }
    }

    // Calibrated human fallback responses
    let fallbackReply = `Don't worry, we are here to help you navigate this safely. Based on what you described, we recommend starting with our ${suggestedAction.label} tool. It will guide you step-by-step on what to do next, how to preserve evidence, and how to protect yourself.`;
    
    if (lower.includes('threat') || lower.includes('blackmail') || lower.includes('private')) {
      fallbackReply = `First, take a deep breath. You are not alone, and you should never send money or comply with extortion demands—paying almost never stops them. Please open our Emergency Blackmail Response tool immediately so we can help you secure your accounts, preserve evidence, and contact official support channels like 1930 and StopNCII.org.`;
    } else if (lower.includes('money') || lower.includes('transferred') || lower.includes('upi')) {
      fallbackReply = `If you recently sent money or suspect fraud, act quickly within the "Golden Hour". Call the National Cyber Crime Helpline at 1930 or your bank's fraud desk to request an urgent transaction freeze. Then use our Scam Incident Response tool to build an official incident record and police complaint.`;
    } else if (lower.includes('photo') || lower.includes('video') || lower.includes('deepfake')) {
      fallbackReply = `Manipulated media and deepfakes are increasingly used to confuse and intimidate people. You can upload the image or video to our Check Media Forensics tool, where ThreatLens will analyze biometric patterns, lighting physics, and AI synthesis markers.`;
    }

    return res.json({
      reply: fallbackReply,
      suggestedAction,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process chat query' });
  }
});

// Setup Vite or static serving
async function setupFrontend() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ThreatLens running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
