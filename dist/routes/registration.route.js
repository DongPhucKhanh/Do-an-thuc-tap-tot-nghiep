"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.verifyToken, registration_controller_1.getMyRegistrations);
router.patch('/:id/status', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.updateStatus);
exports.default = router;
