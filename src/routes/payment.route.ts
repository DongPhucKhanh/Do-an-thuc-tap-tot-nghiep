import { Router } from 'express';
import { 
    createFakePending, 
    cassoWebhookReceiver, 
    forceSuccessPayment, 
    checkPaymentStatus,
    getAllDonations,
    updateDonationStatus
} from '../controllers/payment.controller';

const router = Router();

// 🌟 Sếp kiểm tra xem dòng này đã ghi đúng chữ 'create-fake-pending' chưa:
router.post('/create-fake-pending', createFakePending); 
router.post('/casso-webhook', cassoWebhookReceiver);
router.get('/status/:orderId', checkPaymentStatus);
router.post('/force-success', forceSuccessPayment);

// 🌟 API cho Admin quản lý giao dịch
router.get('/admin/donations', getAllDonations);
router.put('/admin/donations/:id/status', updateDonationStatus);

export default router;