import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORRECCIÓN 1: CORS con lista blanca de orígenes permitidos.
// Antes cualquier sitio web podía hacer peticiones a este servidor.
// Ahora solo se acepta tráfico desde la propia app EscalaPro.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',   // Desarrollo local (Vite)
  'http://localhost:4173',   // Preview local (vite preview)
  'http://localhost:3000',   // Alternativa desarrollo
];

// Si tienes un dominio en producción agrégalo aquí, ejemplo:
// 'https://escalapro.cl'

app.use(cors({
  origin: (origin, callback) => {
    // Permitimos peticiones sin origin (apps móviles, Postman, curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' })); // ✅ Límite de tamaño de petición

// ✅ CORRECCIÓN 2: Middleware de seguridad básica.
// Agrega cabeceras HTTP que protegen contra ataques comunes.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ✅ CORRECCIÓN 3: Rate limiting simple sin dependencias externas.
// Evita que alguien bombardee el servidor con miles de peticiones.
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;        // máximo 100 peticiones
const RATE_WINDOW_MS = 60000;  // por minuto

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return next();
  }

  if (record.count >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Demasiadas peticiones. Intenta nuevamente en un minuto.' 
    });
  }

  record.count++;
  next();
};

app.use(rateLimiter);

// --- ENDPOINTS ---

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor de Escalas Clínicas Pro funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/scales', (_req: Request, res: Response) => {
  res.json({
    message: 'API de escalas disponible para futuras extensiones',
    scales: []
  });
});

// ✅ CORRECCIÓN 4: Manejador de rutas no encontradas (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// ✅ CORRECCIÓN 5: Manejador global de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`Orígenes permitidos: ${ALLOWED_ORIGINS.join(', ')}`);
});

export default app;