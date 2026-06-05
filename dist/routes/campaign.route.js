"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// ================= PUBLIC ROUTES (Không cần đăng nhập) =================
router.get('/', campaign_controller_1.getAll);
// 👇 QUAN TRỌNG: Các route TĨNH phải đặt trước route ĐỘNG (/:id)
router.get('/system-stats', campaign_controller_1.getSystemStats);
router.get('/leaderboard', campaign_controller_1.getFacultyLeaderboard);
// ================= ADMIN DONATION ROUTES =================
router.get('/admin/donations', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, campaign_controller_1.getAllDonations);
router.patch('/admin/donations/:id/status', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, campaign_controller_1.updateDonationStatus);
// 👇 Route /:id phải bị "đẩy" xuống cuối cùng của nhóm GET
router.get('/:id', campaign_controller_1.getCampaignById);
// ================= PROTECTED ROUTES (Cần đăng nhập / Admin) =================
// Đăng ký tham gia và Quyên góp
router.post('/:id/register', auth_middleware_1.verifyToken, registration_controller_1.apply);
router.post('/:id/donate-items', auth_middleware_1.verifyToken, campaign_controller_1.donateItems);
// Quản lý đơn, nhiệm vụ, đánh giá
router.get('/:id/registrations', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, campaign_controller_1.getRegistrations);
router.patch('/registrations/:id/evaluate', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.evaluate);
router.patch('/registrations/:id/task', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.assignTask);
router.delete('/tasks/:taskId', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.removeTask);
// Quản lý tình nguyện viên
router.get('/volunteers/list', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.getAllVolunteers);
router.get('/volunteers/:userId/history', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, registration_controller_1.getVolunteerHistory);
router.get('/nearest/:userId', campaign_controller_1.getNearestCampaigns);
// Quản lý chiến dịch (CRUD)
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, upload_middleware_1.upload.single('image'), campaign_controller_1.create);
router.put('/:id', upload_middleware_1.upload.single('image'), campaign_controller_1.update);
router.patch('/:id', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, campaign_controller_1.update);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.verifyAdmin, campaign_controller_1.remove);
exports.default = router;
