import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import enquiryRoutes from './routes/enquiry.routes';
import chatRoutes from './routes/chat.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { sanitizeNoSqlInjection } from './middleware/validateEnquiry';
import { generalApiLimiter } from './middleware/rateLimiter';
import { connectDatabase, getDbStatus } from './config/database';
import { config } from './config/environment';

// Eagerly connect to database on cold-start
connectDatabase().catch(() => {});

const app: Application = express();

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:*', 'http://127.0.0.1:*', 'https://*.vercel.app', config.clientUrl]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: config.isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
    frameguard: { action: 'deny' },
    noSniff: true
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        config.allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      if (config.isProduction) {
        return callback(new Error(`Origin ${origin} not allowed by CORS.`));
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-admin-token']
  })
);

app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use('/api', sanitizeNoSqlInjection);
app.use('/api', generalApiLimiter);

app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    service: 'DroneTV AI Support & Lead Assistant API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.connected,
      type: dbStatus.type
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
