import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Accepts standard Indian / international phone formats: +91 9876543210, 9876543210, (123) 456-7890
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Strips dangerous HTML tags and script injections from user input
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // remove dangerous angle brackets
    .slice(0, 3000); // cap max length
}

export function validateCreateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { name, email, phone, userType, interest, message } = req.body;
  const errors: Record<string, string> = {};

  // Name validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  // Email validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g., pilot@dronetv.in).';
  }

  // Phone validation
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'Please provide a valid contact number (7 to 15 digits).';
  }

  // User Type validation
  const validUserTypes = ['Student', 'Customer', 'Other'];
  if (!userType || typeof userType !== 'string' || !validUserTypes.includes(userType.trim())) {
    errors.userType = 'Please select a valid user type (Student, Customer, or Other).';
  }

  // Interest validation
  if (!interest || typeof interest !== 'string' || !interest.trim()) {
    errors.interest = 'Service or course of interest is required.';
  } else if (interest.trim().length > 150) {
    errors.interest = 'Interest description is too long.';
  }

  // Message validation
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

  // Sanitize cleaned inputs
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

  if (email !== undefined && !EMAIL_REGEX.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (phone !== undefined && !PHONE_REGEX.test(phone)) {
    errors.phone = 'Please provide a valid phone number.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed for update.',
      errors
    });
    return;
  }

  // Sanitize update fields
  if (req.body.name) req.body.name = sanitizeString(req.body.name);
  if (req.body.email) req.body.email = sanitizeString(req.body.email).toLowerCase();
  if (req.body.phone) req.body.phone = sanitizeString(req.body.phone);
  if (req.body.interest) req.body.interest = sanitizeString(req.body.interest);
  if (req.body.message) req.body.message = sanitizeString(req.body.message);
  if (req.body.adminNotes !== undefined) req.body.adminNotes = sanitizeString(req.body.adminNotes);

  next();
}
