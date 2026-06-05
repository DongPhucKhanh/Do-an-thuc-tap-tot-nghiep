"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moment_controller_1 = require("../controllers/moment.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.get('/', moment_controller_1.getAllMoments);
router.post('/', upload_middleware_1.upload.array('media', 10), moment_controller_1.createMoment);
router.post('/:momentId/comments', moment_controller_1.addComment); // 🌟 THÊM ĐƯỜNG DẪN NÀY
// Thêm vào cùng cụm các route khác của moment
router.patch('/:momentId/like', moment_controller_1.likeMoment); // Đường dẫn xử lý Thích
router.post('/:momentId/share', moment_controller_1.shareMoment); // Đường dẫn xử lý Chia sẻ
exports.default = router;
