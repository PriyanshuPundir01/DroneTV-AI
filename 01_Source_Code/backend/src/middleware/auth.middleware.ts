import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, hashPassword } from '../utils/security';
import { config } from '../config/environment';

const initialHash = hashPassword(config.adminPassword);

export const ADMIN_AUTH_STORE = {
  email: config.adminEmail,
  salt: initialHash.salt,
  hash: initialHash.hash
};

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    email: string;
    role: string;
  };
}

export function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'];

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. No session token provided.'
    });
    return;
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Administrator token is invalid or expired.'
    });
    return;
  }

  req.adminUser = {
    email: payload.email,
    role: payload.role
  };

  next();
}
