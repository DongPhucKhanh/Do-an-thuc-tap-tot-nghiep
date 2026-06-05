"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const payment_controller_2 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
// 🌟 Sếp kiểm tra xem dòng này đã ghi đúng chữ 'create-fake-pending' chưa:
router.post('/create-fake-pending', payment_controller_1.createFakePending);
router.post('/casso-webhook', payment_controller_1.cassoWebhookReceiver);
router.get('/status/:orderId', payment_controller_2.checkPaymentStatus);
router.post('/force-success', payment_controller_1.forceSuccessPayment);
exports.default = router;
