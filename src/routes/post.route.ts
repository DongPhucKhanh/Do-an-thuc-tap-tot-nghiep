import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ ảnh tin tức đưa vào thư mục cục bộ uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'news-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const router = Router();

// 🔓 Các Router công khai công cộng ai cũng xem được (Trang chủ, Tin tức)
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// 🔒 Các Router bảo mật cao (Bắt buộc Token + Phải là quyền ADMIN Ban tổ chức)
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createPost);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updatePost);
router.delete('/:id', verifyToken, verifyAdmin, deletePost);

export default router;