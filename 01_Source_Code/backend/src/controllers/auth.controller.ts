import { Request, Response } from 'express';
import { ADMIN_CREDENTIALS } from '../middleware/auth.middleware';

export function loginAdmin(req: Request, res: Response): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Both administrator email and password are required.'
    });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rawPassword = String(password).trim();

  if (
    normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
    rawPassword === ADMIN_CREDENTIALS.password
  ) {
    res.status(200).json({
      success: true,
      message: 'Administrator authentication successful.',
      data: {
        token: ADMIN_CREDENTIALS.token,
        user: {
          name: 'Flight Operations Director',
          email: ADMIN_CREDENTIALS.email,
          role: 'Administrator'
        }
      }
    });
    return;
  }

  res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials. Access denied.'
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

  if (token === ADMIN_CREDENTIALS.token) {
    res.status(200).json({
      success: true,
      valid: true,
      data: {
        email: ADMIN_CREDENTIALS.email,
        role: 'Administrator'
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
