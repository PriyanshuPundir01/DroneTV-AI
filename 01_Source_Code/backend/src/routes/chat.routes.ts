import { Router } from 'express';
import { handleChatMessage, getQuickQuestions } from '../controllers/chat.controller';
import { chatQueryLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/questions', getQuickQuestions);
router.post('/message', chatQueryLimiter, handleChatMessage);

export default router;
