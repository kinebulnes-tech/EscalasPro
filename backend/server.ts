import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// === CORS ===
// En producción, leer desde variable de entorno ALLOWED_ORIGINS="https://escalapro.cl,https://www.escalapro.cl"
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`Origen bloqueado por CORS: ${origin}`));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// === SEGURIDAD ===
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// === RATE LIMITING ===
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = NODE_ENV === 'production' ? 60 : 200;
const RATE_WINDOW_MS = 60_000;

app.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return next();
  }
  if (record.count >= RATE_LIMIT) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Demasiadas peticiones. Intenta en un minuto.' });
  }
  record.count++;
  next();
});

// === LOGGING ESTRUCTURADO ===
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (NODE_ENV === 'production') {
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip,
    }));
  }
  next();
});

// === ENDPOINTS ===

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Endpoint preparado para servir escalas desde DB en futuro
app.get('/api/scales', (_req: Request, res: Response) => {
  res.json({ scales: [], message: 'Escalas gestionadas localmente en el cliente.' });
});

// === 404 y ERRORES ===
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: NODE_ENV === 'production' ? 'Error interno' : err.message });
});

app.listen(PORT, () => {
  console.log(`[EscalaPro] Servidor ${NODE_ENV} → http://localhost:${PORT}`);
  console.log(`[EscalaPro] CORS permitido: ${ALLOWED_ORIGINS.join(', ')}`);
});

export default app;
