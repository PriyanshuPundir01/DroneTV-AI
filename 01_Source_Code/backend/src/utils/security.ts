import crypto from 'crypto';
import { config } from '../config/environment';

export interface TokenPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Derives a cryptographic hash of a plaintext password using scrypt
 */
export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const currentSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, currentSalt, 64).toString('hex');
  return { salt: currentSalt, hash: derivedKey };
}

/**
 * Constant-time verification of a password against a stored salt and hash
 */
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const a = Buffer.from(derivedKey, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Signs an admin session token using HMAC-SHA256
 */
export function generateAdminToken(email: string, role = 'Administrator'): string {
  const iat = Date.now();
  const exp = iat + config.sessionExpiryHours * 60 * 60 * 1000;
  const payload: TokenPayload = { email, role, iat, exp };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

/**
 * Validates a signed admin session token and verifies expiration
 */
export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadEncoded, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', config.jwtSecret)
      .update(payloadEncoded)
      .digest('base64url');

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);
    if (sigA.length !== sigB.length) return null;
    if (!crypto.timingSafeEqual(sigA, sigB)) return null;

    const decoded = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf-8')) as TokenPayload;
    if (Date.now() > decoded.exp) {
      return null; // Token expired
    }

    return decoded;
  } catch {
    return null;
  }
}
