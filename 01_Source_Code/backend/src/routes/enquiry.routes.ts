import { Router } from 'express';
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats
} from '../controllers/enquiry.controller';
import {
  validateCreateEnquiry,
  validateUpdateEnquiry
} from '../middleware/validateEnquiry';
import { requireAdminAuth } from '../middleware/auth.middleware';
import { enquirySubmissionLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', enquirySubmissionLimiter, validateCreateEnquiry, createEnquiry);
router.get('/stats/summary', requireAdminAuth, getEnquiryStats);
router.get('/', requireAdminAuth, getEnquiries);
router.get('/:id', requireAdminAuth, getEnquiryById);
router.put('/:id', requireAdminAuth, validateUpdateEnquiry, updateEnquiry);
router.patch('/:id', requireAdminAuth, validateUpdateEnquiry, updateEnquiry);
router.delete('/:id', requireAdminAuth, deleteEnquiry);

export default router;
