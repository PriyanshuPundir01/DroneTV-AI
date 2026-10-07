import { Request, Response, NextFunction } from 'express';

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@dronetv.in',
  password: process.env.ADMIN_PASSWORD || 'DroneTV@2026',
  token: process.env.ADMIN_SESSION_TOKEN || 'dronetv_admin_session_auth_key_2026'
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
  // Allow direct access without password/token requirement
  req.adminUser = {
    email: ADMIN_CREDENTIALS.email,
    role: 'Administrator'
  };

  next();
}
