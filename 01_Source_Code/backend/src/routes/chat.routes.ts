import { Router } from 'express';
import { handleChatMessage, getQuickQuestions } from '../controllers/chat.controller';

const router = Router();

router.get('/questions', getQuickQuestions);
router.post('/message', handleChatMessage);

export default router;
