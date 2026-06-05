import { Router } from 'express';
import { askAssistant } from '../controllers/ai.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// 👇 Dòng code bạn vừa hỏi sẽ được đặt trọn vẹn ở đây
router.post('/ask', verifyToken, verifyAdmin, askAssistant);

export default router;