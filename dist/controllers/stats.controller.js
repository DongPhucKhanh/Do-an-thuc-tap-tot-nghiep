"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        // 1. Đếm các chỉ số tổng quan
        const totalVolunteers = await prisma_1.default.user.count({ where: { role: 'VOLUNTEER' } });
        const totalCampaigns = await prisma_1.default.campaign.count();
        const totalRegistrations = await prisma_1.default.registration.count();
        const approvedRegistrations = await prisma_1.default.registration.count({ where: { status: 'APPROVED' } });
        // 2. Thống kê số lượng sinh viên theo Khoa (Để vẽ biểu đồ)
        const faculties = await prisma_1.default.faculty.findMany({
            include: {
                _count: {
                    select: { users: { where: { role: 'VOLUNTEER' } } }
                }
            }
        });
        // Format lại dữ liệu cho biểu đồ Frontend dễ đọc
        const chartData = faculties.map(f => ({
            name: f.name,
            totalStudents: f._count.users
        }));
        res.status(200).json({
            data: {
                overview: { totalVolunteers, totalCampaigns, totalRegistrations, approvedRegistrations },
                chartData
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: "Lỗi lấy thống kê" });
    }
};
exports.getDashboardStats = getDashboardStats;
