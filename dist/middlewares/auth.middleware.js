"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    // Lấy token từ header của Request (Frontend sẽ gửi lên qua header 'Authorization')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Định dạng chuẩn: "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Không tìm thấy Token. Vui lòng đăng nhập!" });
        return;
    }
    try {
        // Giải mã token xem có hợp lệ không (dùng secret key trong file .env)
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // Cho phép đi tiếp vào Controller
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
exports.verifyToken = verifyToken;
const verifyAdmin = (req, res, next) => {
    const role = req.user?.role;
    if (role === 'ADMIN' || role === 'ORGANIZATION') {
        next();
    }
    else {
        res.status(403).json({ error: "Bạn không có quyền hạn (Chỉ Admin/Tổ chức mới được phép)!" });
    }
};
exports.verifyAdmin = verifyAdmin;
