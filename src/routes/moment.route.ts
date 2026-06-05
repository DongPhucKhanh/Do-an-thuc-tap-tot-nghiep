import { Router } from 'express';
import { getAllMoments, createMoment, addComment,likeMoment ,shareMoment} from '../controllers/moment.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getAllMoments);
router.post('/', upload.array('media', 10), createMoment);
router.post('/:momentId/comments', addComment); // 🌟 THÊM ĐƯỜNG DẪN NÀY
// Thêm vào cùng cụm các route khác của moment
router.patch('/:momentId/like', likeMoment);   // Đường dẫn xử lý Thích
router.post('/:momentId/share', shareMoment); // Đường dẫn xử lý Chia sẻ

export default router;