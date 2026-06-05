"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// 🌟 CẤU HÌNH THƯ MỤC LƯU TRỮ VÀ TÊN FILE MÃ HÓA CHO AVATAR SINH VIÊN
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu file vào thư mục gốc uploads/ ở backend
    },
    filename: (req, file, cb) => {
        // Tạo chuỗi tên file độc nhất tránh trùng lặp: VD: 1717462140000.jpg
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.login);
// 🌟 CẬP NHẬT TẠI ĐÂY: Nhúng middleware upload.single('avatar') đón đầu tệp tin gửi lên
router.get('/profile', auth_middleware_1.verifyToken, user_controller_1.getProfile);
router.put('/profile', auth_middleware_1.verifyToken, upload.single('avatar'), user_controller_1.updateProfile);
router.get('/activities-history', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, user_controller_1.getUsersWithActivities);
router.get('/', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, user_controller_1.getAll);
router.patch('/:id/role', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, user_controller_1.updateRole);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, user_controller_1.removeUser);
exports.default = router;
