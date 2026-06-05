"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Cấu hình lưu trữ ảnh tin tức đưa vào thư mục cục bộ uploads/
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'news-' + Date.now() + path_1.default.extname(file.originalname))
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// 🔓 Các Router công khai công cộng ai cũng xem được (Trang chủ, Tin tức)
router.get('/', post_controller_1.getAllPosts);
router.get('/:id', post_controller_1.getPostById);
// 🔒 Các Router bảo mật cao (Bắt buộc Token + Phải là quyền ADMIN Ban tổ chức)
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, upload.single('image'), post_controller_1.createPost);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, upload.single('image'), post_controller_1.updatePost);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, post_controller_1.deletePost);
exports.default = router;
