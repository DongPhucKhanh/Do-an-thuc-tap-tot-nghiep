// Trong src/routes/banner.route.ts
import { Router } from 'express';
import { createBanner, getActiveBanners, deleteBanner } from '../controllers/banner.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
router.get('/', getActiveBanners);
router.post('/', upload.single('image'), createBanner);
router.delete('/:id', deleteBanner);

export default router;

