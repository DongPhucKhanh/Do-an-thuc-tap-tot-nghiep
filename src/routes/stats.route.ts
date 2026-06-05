import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.get('/dashboard', verifyToken, verifyAdmin, getDashboardStats);
export default router;