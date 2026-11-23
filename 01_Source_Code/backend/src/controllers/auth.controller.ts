import { Request, Response } from 'express';
import { ADMIN_AUTH_STORE } from '../middleware/auth.middleware';
import { verifyPassword, generateAdminToken, verifyAdminToken } from '../utils/security';

export function loginAdmin(req: Request, res: Response): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and access key are required.'
    });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rawPassword = String(password);

  const isEmailMatch = normalizedEmail === ADMIN_AUTH_STORE.email;
  const isPasswordValid = verifyPassword(rawPassword, ADMIN_AUTH_STORE.salt, ADMIN_AUTH_STORE.hash);

  if (isEmailMatch && isPasswordValid) {
    const token = generateAdminToken(ADMIN_AUTH_STORE.email, 'Administrator');
    res.status(200).json({
      success: true,
      message: 'Authentication verified.',
      data: {
        token,
        user: {
          name: 'Flight Operations Director',
          email: ADMIN_AUTH_STORE.email,
          role: 'Administrator'
        }
      }
    });
    return;
  }

  res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials.'
  });
}

export function verifyAdminSession(req: Request, res: Response): void {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'];

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  const payload = verifyAdminToken(token);

  if (payload) {
    res.status(200).json({
      success: true,
      valid: true,
      data: {
        email: payload.email,
        role: payload.role
      }
    });
    return;
  }

  res.status(401).json({
    success: false,
    valid: false,
    message: 'Administrator session token is invalid or expired.'
  });
}
