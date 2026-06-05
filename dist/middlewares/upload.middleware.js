"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Cấu hình nơi lưu file và tên file
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Giữ nguyên lưu vào thư mục uploads ở root của Khoa
    },
    filename: function (req, file, cb) {
        // 🌟 ĐÃ CẬP NHẬT: Thêm một chuỗi số ngẫu nhiên đằng sau Date.now()
        // Vì khi Khoa up nhiều file cùng 1 lượt, thời gian Date.now() sẽ bị trùng khít nhau, làm các file đè chết nhau.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// 🌟 ĐÃ CẬP NHẬT: Mở khóa chấp nhận cả file ảnh (image/) và file video (video/)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true); // Hợp lệ, cho qua
    }
    else {
        cb(new Error('Chỉ cho phép tải lên file hình ảnh hoặc video công khai!'), false);
    }
};
// 🌟 ĐÃ CẬP NHẬT: Thêm cấu hình giới hạn dung lượng tối đa (limits)
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // Nới rộng lên tối đa 100MB để xử lý mượt mà các file video nặng
    }
});
