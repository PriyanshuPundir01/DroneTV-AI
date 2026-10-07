import { Router } from 'express';
import { loginAdmin, verifyAdminSession } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginAdmin);
router.get('/verify', verifyAdminSession);

export default router;
