import { Router } from 'express';
import { 
    create, getAll, getRegistrations, update, remove, 
    getCampaignById, getSystemStats, getFacultyLeaderboard,
    updateDonationStatus, donateItems, getAllDonations, getNearestCampaigns, scanQR,
    getCampaignTasks, updateTaskStatus, getCampaignMessages
} from '../controllers/campaign.controller';

import { 
    apply, 
    evaluate, 
    assignTask, 
    removeTask, 
    getAllVolunteers, 
    getVolunteerHistory 
} from '../controllers/registration.controller'; 

import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// ================= PUBLIC ROUTES (Không cần đăng nhập) =================
router.get('/', getAll);

// 👇 QUAN TRỌNG: Các route TĨNH phải đặt trước route ĐỘNG (/:id)
router.get('/system-stats', getSystemStats); 
router.get('/leaderboard', getFacultyLeaderboard); 

// ================= ADMIN DONATION ROUTES =================
router.get('/admin/donations', verifyToken, verifyAdmin, getAllDonations);
router.patch('/admin/donations/:id/status', verifyToken, verifyAdmin, updateDonationStatus);

// 👇 Route /:id phải bị "đẩy" xuống cuối cùng của nhóm GET
router.get('/:id', getCampaignById);

// ================= PROTECTED ROUTES (Cần đăng nhập / Admin) =================
// Đăng ký tham gia và Quyên góp
router.post('/:id/register', verifyToken, apply); 
router.post('/:id/donate-items', verifyToken, donateItems);
router.post('/:id/scan-qr', verifyToken, scanQR);

// Quản lý đơn, nhiệm vụ, đánh giá
router.get('/:id/registrations', verifyToken, verifyAdmin, getRegistrations);
router.patch('/registrations/:id/evaluate', verifyToken, verifyAdmin, evaluate);
router.patch('/registrations/:id/task', verifyToken, verifyAdmin, assignTask); 
router.delete('/tasks/:taskId', verifyToken, verifyAdmin, removeTask); 

// KANBAN BOARD ROUTES
router.get('/:id/tasks', verifyToken, verifyAdmin, getCampaignTasks);
router.patch('/tasks/:taskId/status', verifyToken, verifyAdmin, updateTaskStatus);

// REAL-TIME CHAT ROUTES
router.get('/:id/messages', verifyToken, getCampaignMessages);

// Quản lý tình nguyện viên
router.get('/volunteers/list', verifyToken, verifyAdmin, getAllVolunteers); 
router.get('/volunteers/:userId/history', verifyToken, verifyAdmin, getVolunteerHistory); 
router.get('/nearest/:userId', getNearestCampaigns);

// Quản lý chiến dịch (CRUD)
router.post('/', verifyToken, verifyAdmin, upload.single('image'), create);
router.put('/:id', upload.single('image'), update);
router.patch('/:id', verifyToken, verifyAdmin, update);
router.delete('/:id', verifyToken, verifyAdmin, remove);

export default router;