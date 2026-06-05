"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRegistrations = exports.getVolunteerHistory = exports.getAllVolunteers = exports.removeTask = exports.assignTask = exports.evaluate = exports.updateStatus = exports.apply = void 0;
const registrationService = __importStar(require("../services/registration.service"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const apply = async (req, res) => {
    try {
        // Lấy ID người dùng từ Token
        const userId = req.user.id;
        // Thêm "as string" và số "10" (hệ thập phân) để TypeScript hết báo lỗi
        const campaignId = parseInt(req.params.id, 10);
        if (isNaN(campaignId)) {
            res.status(400).json({ error: "ID chiến dịch không hợp lệ!" });
            return;
        }
        const result = await registrationService.applyForCampaign(userId, campaignId);
        res.status(201).json({
            message: "Đăng ký tham gia thành công! Đơn của bạn đang chờ duyệt.",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.apply = apply;
const updateStatus = async (req, res) => {
    try {
        const regId = parseInt(req.params.id, 10);
        const { status } = req.body; // Admin sẽ gửi 'APPROVED' hoặc 'REJECTED' lên từ Body
        if (isNaN(regId)) {
            res.status(400).json({ error: "ID đơn đăng ký không hợp lệ!" });
            return;
        }
        // Chặn nhập linh tinh, chỉ cho phép 2 trạng thái này
        if (status !== 'APPROVED' && status !== 'REJECTED') {
            res.status(400).json({ error: "Trạng thái không hợp lệ! Chỉ nhận APPROVED hoặc REJECTED." });
            return;
        }
        const result = await registrationService.updateRegistrationStatus(regId, status);
        res.status(200).json({
            message: `Đã cập nhật trạng thái thành ${status}!`,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateStatus = updateStatus;
// API Lưu đánh giá (Lưu vào bảng Evaluation mới)
const evaluate = async (req, res) => {
    try {
        const registrationId = parseInt(req.params.id);
        const { notes, rating } = req.body; // Frontend sẽ gửi nhận xét và số sao
        await prisma.evaluation.create({
            data: {
                registrationId: registrationId,
                comment: notes || "Không có nhận xét",
                rating: rating || 5 // Tạm thời mặc định cho 5 sao nếu Frontend chưa gửi
            }
        });
        res.status(200).json({ message: "Đã lưu đánh giá vào hệ thống mới!" });
    }
    catch (error) {
        res.status(400).json({ error: "Lỗi khi lưu đánh giá: " + error.message });
    }
};
exports.evaluate = evaluate;
// API Phân công nhiệm vụ (Lưu vào bảng Task mới)
const assignTask = async (req, res) => {
    try {
        const registrationId = parseInt(req.params.id);
        const { assignedTask, description } = req.body;
        await prisma.task.create({
            data: {
                registrationId: registrationId,
                taskName: assignedTask,
                description: description || ""
            }
        });
        res.status(200).json({ message: "Đã giao việc thành công vào hệ thống mới!" });
    }
    catch (error) {
        res.status(400).json({ error: "Lỗi phân công: " + error.message });
    }
};
exports.assignTask = assignTask;
const removeTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        await prisma.task.delete({
            where: { id: taskId }
        });
        res.status(200).json({ message: "Đã thu hồi nhiệm vụ thành công!" });
    }
    catch (error) {
        res.status(400).json({ error: "Lỗi khi thu hồi: " + error.message });
    }
};
exports.removeTask = removeTask;
// 2. Lấy danh sách tất cả Tình nguyện viên (để Admin chọn lúc xem lịch sử)
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await prisma.user.findMany({
            where: { role: 'VOLUNTEER' }, // Chỉ lấy những user có quyền VOLUNTEER
            select: { id: true, fullName: true, email: true }
        });
        res.status(200).json({ data: volunteers });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllVolunteers = getAllVolunteers;
// 3. Lấy lịch sử tham gia của 1 Tình nguyện viên cụ thể
const getVolunteerHistory = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const history = await prisma.registration.findMany({
            where: { userId: userId },
            include: {
                campaign: {
                    select: { title: true, startDate: true, endDate: true, status: true }
                },
                tasks: true,
                evaluations: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        res.status(200).json({ data: history });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getVolunteerHistory = getVolunteerHistory;
// API: Sinh viên xem "Việc của tôi" (Lịch sử đăng ký cá nhân)
const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ Token
        const history = await prisma.registration.findMany({
            where: { userId: userId },
            include: {
                campaign: {
                    select: { title: true, location: true, startDate: true, endDate: true }
                },
                tasks: true,
                evaluations: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        res.status(200).json({ data: history });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getMyRegistrations = getMyRegistrations;
