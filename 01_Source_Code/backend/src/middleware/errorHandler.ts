import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

export interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string>;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isProd = config.isProduction;

  if (!isProd && err.stack) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : err.message || 'Request failed',
    ...(err.errors && { errors: err.errors })
  });
}
