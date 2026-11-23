import { Router } from 'express';
import { loginAdmin, verifyAdminSession } from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, loginAdmin);
router.get('/verify', verifyAdminSession);

export default router;
