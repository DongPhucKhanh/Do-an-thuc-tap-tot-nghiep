import { Router } from 'express';
import { createFakePending, cassoWebhookReceiver,forceSuccessPayment } from '../controllers/payment.controller';
import { checkPaymentStatus } from '../controllers/payment.controller';
const router = Router();

// 🌟 Sếp kiểm tra xem dòng này đã ghi đúng chữ 'create-fake-pending' chưa:
router.post('/create-fake-pending', createFakePending); 
router.post('/casso-webhook', cassoWebhookReceiver);
router.get('/status/:orderId', checkPaymentStatus);
router.post('/force-success', forceSuccessPayment);
export default router;