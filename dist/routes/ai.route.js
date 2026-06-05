"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// 👇 Dòng code bạn vừa hỏi sẽ được đặt trọn vẹn ở đây
router.post('/ask', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, ai_controller_1.askAssistant);
exports.default = router;
