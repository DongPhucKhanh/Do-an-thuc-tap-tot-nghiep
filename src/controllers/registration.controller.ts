import { Response } from 'express';
import * as registrationService from '../services/registration.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendCampaignApprovalEmail,sendCampaignRejectionEmail } from '../utils/email.util';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const apply = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Lấy ID người dùng từ Token
        const userId = req.user.id; 
        
        // Thêm "as string" và số "10" (hệ thập phân) để TypeScript hết báo lỗi
        const campaignId = parseInt(req.params.id as string, 10); 

        if (isNaN(campaignId)) {
            res.status(400).json({ error: "ID chiến dịch không hợp lệ!" });
            return;
        }

        const result = await registrationService.applyForCampaign(userId, campaignId);
        
        res.status(201).json({
            message: "Đăng ký tham gia thành công! Đơn của bạn đang chờ duyệt.",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const regId = parseInt(req.params.id as string, 10); 
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
        
        // 🌟 XỬ LÝ LÔ-GÍC BẮN EMAIL CHO CẢ 2 TRƯỜNG HỢP ĐẬU / RỚT
        const regInfo = await prisma.registration.findUnique({
            where: { id: regId },
            include: {
                user: true,
                campaign: true
            }
        });

        if (regInfo && regInfo.user && regInfo.campaign) {
            const volunteerName = regInfo.user.fullName || 'Tình nguyện viên';
            const campaignTitle = regInfo.campaign.title; // Đổi thành .name nếu DB mày dùng chữ name

            if (status === 'APPROVED') {
                const timeStr = regInfo.campaign.startDate 
                    ? new Date(regInfo.campaign.startDate).toLocaleString('vi-VN') 
                    : 'Sẽ thông báo sau';

                await sendCampaignApprovalEmail(
                    regInfo.user.email,
                    volunteerName,
                    campaignTitle,
                    timeStr,
                    regInfo.campaign.location || 'Sẽ thông báo sau'
                );
            } else if (status === 'REJECTED') {
                await sendCampaignRejectionEmail(
                    regInfo.user.email,
                    volunteerName,
                    campaignTitle
                );
            }
        }

        res.status(200).json({
            message: `Đã cập nhật trạng thái thành ${status}!`,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
// API Lưu đánh giá (Lưu vào bảng Evaluation mới)
export const evaluate = async (req: any, res: any): Promise<void> => {
    try {
        const registrationId = parseInt(req.params.id as string);
        const { notes, rating } = req.body; // Frontend sẽ gửi nhận xét và số sao
        
        await prisma.evaluation.create({
            data: {
                registrationId: registrationId,
                comment: notes || "Không có nhận xét",
                rating: rating || 5 // Tạm thời mặc định cho 5 sao nếu Frontend chưa gửi
            }
        });
        
        res.status(200).json({ message: "Đã lưu đánh giá vào hệ thống mới!" });
    } catch (error: any) {
        res.status(400).json({ error: "Lỗi khi lưu đánh giá: " + error.message });
    }
};

// API Phân công nhiệm vụ (Lưu vào bảng Task mới)
export const assignTask = async (req: any, res: any): Promise<void> => {
    try {
        const registrationId = parseInt(req.params.id as string);
        const { assignedTask, description } = req.body;
        
        await prisma.task.create({
            data: {
                registrationId: registrationId,
                taskName: assignedTask,
                description: description || ""
            }
        });
        
        res.status(200).json({ message: "Đã giao việc thành công vào hệ thống mới!" });
    } catch (error: any) {
        res.status(400).json({ error: "Lỗi phân công: " + error.message });
    }
};

export const removeTask = async (req: any, res: any): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId as string);
        await prisma.task.delete({
            where: { id: taskId }
        });
        res.status(200).json({ message: "Đã thu hồi nhiệm vụ thành công!" });
    } catch (error: any) {
        res.status(400).json({ error: "Lỗi khi thu hồi: " + error.message });
    }
};

// 2. Lấy danh sách tất cả Tình nguyện viên (để Admin chọn lúc xem lịch sử)
export const getAllVolunteers = async (req: any, res: any): Promise<void> => {
    try {
        const volunteers = await prisma.user.findMany({
            where: { role: 'VOLUNTEER' }, // Chỉ lấy những user có quyền VOLUNTEER
            select: { id: true, fullName: true, email: true }
        });
        res.status(200).json({ data: volunteers });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// 3. Lấy lịch sử tham gia của 1 Tình nguyện viên cụ thể
export const getVolunteerHistory = async (req: any, res: any): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId as string);
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
// API: Sinh viên xem "Việc của tôi" (Lịch sử đăng ký cá nhân)
export const getMyRegistrations = async (req: any, res: any): Promise<void> => {
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};