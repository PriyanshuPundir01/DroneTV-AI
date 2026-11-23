import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

const envAllowed = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  allowedOrigins: Array.from(new Set([...defaultAllowedOrigins, ...envAllowed, process.env.CLIENT_URL || 'http://localhost:5173'])),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dronetv_db',
  useFallbackStore: process.env.USE_FALLBACK_STORE !== 'false',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@dronetv.in').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || 'DroneTV@2026',
  jwtSecret: process.env.JWT_SECRET || 'dronetv_default_fallback_secret_key_development_only',
  sessionExpiryHours: process.env.ADMIN_SESSION_EXPIRY_HOURS ? parseInt(process.env.ADMIN_SESSION_EXPIRY_HOURS, 10) : 24
};
