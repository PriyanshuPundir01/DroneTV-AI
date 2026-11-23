import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Strips script tags, HTML tags, dangerous attributes, and null bytes from user input
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags & content
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // remove iframe tags
    .replace(/javascript:[^"']*/gi, '') // remove javascript: pseudo-protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // remove inline event handlers (onerror=, onload=, etc.)
    .replace(/[<>]/g, '') // strip remaining angle brackets
    .trim()
    .slice(0, 3000);
}

/**
 * Middleware to protect against NoSQL operator injection in body, query, and params
 */
export function sanitizeNoSqlInjection(req: Request, res: Response, next: NextFunction): void {
  const containsNoSqlOperator = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        return true;
      }
      if (typeof obj[key] === 'object' && containsNoSqlOperator(obj[key])) {
        return true;
      }
    }
    return false;
  };

  if (containsNoSqlOperator(req.body) || containsNoSqlOperator(req.query) || containsNoSqlOperator(req.params)) {
    res.status(400).json({
      success: false,
      message: 'Malicious query operators detected. Request rejected.'
    });
    return;
  }

  next();
}

export function validateCreateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { name, email, phone, userType, interest, message } = req.body;
  const errors: Record<string, string> = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g., pilot@dronetv.in).';
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'Please provide a valid contact number (7 to 15 digits).';
  }

  const validUserTypes = ['Student', 'Customer', 'Other'];
  if (!userType || typeof userType !== 'string' || !validUserTypes.includes(userType.trim())) {
    errors.userType = 'Please select a valid user type (Student, Customer, or Other).';
  }

  if (!interest || typeof interest !== 'string' || !interest.trim()) {
    errors.interest = 'Service or course of interest is required.';
  } else if (interest.trim().length > 150) {
    errors.interest = 'Interest description is too long.';
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Please provide an enquiry message or question.';
  } else if (message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters long.';
  } else if (message.trim().length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors
    });
    return;
  }

  req.body.name = sanitizeString(name);
  req.body.email = sanitizeString(email).toLowerCase();
  req.body.phone = sanitizeString(phone);
  req.body.userType = sanitizeString(userType);
  req.body.interest = sanitizeString(interest);
  req.body.message = sanitizeString(message);
  if (req.body.adminNotes) {
    req.body.adminNotes = sanitizeString(req.body.adminNotes);
  }

  next();
}

export function validateUpdateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { status, adminNotes, email, phone } = req.body;
  const errors: Record<string, string> = {};

  if (status !== undefined) {
    const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed'];
    if (!validStatuses.includes(status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }
  }

  if (email !== undefined && !EMAIL_REGEX.test(String(email).trim())) {
    errors.email = 'Provided email format is invalid.';
  }

  if (phone !== undefined && !PHONE_REGEX.test(String(phone).trim())) {
    errors.phone = 'Provided phone format is invalid.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      message: 'Update validation failed.',
      errors
    });
    return;
  }

  if (adminNotes !== undefined) {
    req.body.adminNotes = sanitizeString(adminNotes);
  }
  if (req.body.message !== undefined) {
    req.body.message = sanitizeString(req.body.message);
  }
  if (req.body.name !== undefined) {
    req.body.name = sanitizeString(req.body.name);
  }

  next();
}
