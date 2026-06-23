import { Router } from 'express';
import { submitContact, getAllContacts, replyContact } from '../controllers/contact.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public: Người dùng gửi liên hệ
router.post('/', submitContact);

// Admin: Xem và phản hồi
router.get('/', verifyToken, verifyAdmin, getAllContacts);
router.put('/:id/reply', verifyToken, verifyAdmin, replyContact);

export default router;
