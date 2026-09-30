import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // In-memory submissions store for teacher inspection & backup
  const serverSubmissions: any[] = [];

  const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwE2DzqF5lwECpn85IzVWaFIIB5H-uVsu7-Ms8i4tTYwjrWuX_FE8ErrewLFOIQxkkEsw/exec';

  // API endpoint for submission local memory backup (does NOT re-post to GAS to prevent duplicate rows)
  app.post('/api/submit', (req, res) => {
    try {
      const data = req.body;
      serverSubmissions.unshift(data);
      res.json({ success: true, count: serverSubmissions.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/submissions', (_req, res) => {
    res.json(serverSubmissions);
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
