import { Router } from 'express';
import { 
    registerUser, 
    login, 
    getProfile, 
    updateProfile, 
    updateRole, 
    removeUser, 
    getAll, 
    getUsersWithActivities,
    
    // 🌟 IMPORT 2 HÀM MỚI TỪ CONTROLLER
    requestPasswordReset,
    resetPassword,
    verifyEmailOtp

} from '../controllers/user.controller';
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware';
import multer from 'multer';
import path from 'path';

// 🌟 CẤU HÌNH THƯ MỤC LƯU TRỮ VÀ TÊN FILE MÃ HÓA CHO AVATAR SINH VIÊN
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu file vào thư mục gốc uploads/ ở backend
    },
    filename: (req, file, cb) => {
        // Tạo chuỗi tên file độc nhất tránh trùng lặp: VD: 1717462140000.jpg
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const router = Router();

// =========================================================
// API XÁC THỰC & TÀI KHOẢN
// =========================================================
router.post('/register', registerUser);
router.post('/login', login); 

// 🌟 TÍNH NĂNG QUÊN MẬT KHẨU
router.post('/request-password-reset', requestPasswordReset); // API gửi mã OTP qua Email
router.post('/reset-password', resetPassword);               // API đặt lại mật khẩu mới

// =========================================================
// API THÔNG TIN CÁ NHÂN (PROFILE)
// =========================================================
// Nhúng middleware upload.single('avatar') đón đầu tệp tin gửi lên
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), updateProfile); 
router.post('/verify-email', verifyEmailOtp);
// =========================================================
// API QUẢN TRỊ (ADMIN)
// =========================================================
router.get('/activities-history', verifyToken, verifyAdmin, getUsersWithActivities);
router.get('/', verifyToken, verifyAdmin, getAll);
router.patch('/:id/role', verifyToken, verifyAdmin, updateRole);
router.delete('/:id', verifyToken, verifyAdmin, removeUser);

export default router;