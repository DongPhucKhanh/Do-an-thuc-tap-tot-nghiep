import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Đếm các chỉ số tổng quan
        const totalVolunteers = await prisma.user.count({ where: { role: 'VOLUNTEER' } });
        const totalCampaigns = await prisma.campaign.count();
        const totalRegistrations = await prisma.registration.count();
        const approvedRegistrations = await prisma.registration.count({ where: { status: 'APPROVED' } });

        // 2. Thống kê số lượng sinh viên theo Khoa (Để vẽ biểu đồ)
        const faculties = await prisma.faculty.findMany({
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
    } catch (error: any) {
        res.status(500).json({ error: "Lỗi lấy thống kê" });
    }
};