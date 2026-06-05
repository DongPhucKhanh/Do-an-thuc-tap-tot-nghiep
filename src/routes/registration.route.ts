import { Router } from 'express';
import { updateStatus, getMyRegistrations } from '../controllers/registration.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', verifyToken, getMyRegistrations);

router.patch('/:id/status', verifyToken, verifyAdmin, updateStatus);

export default router;