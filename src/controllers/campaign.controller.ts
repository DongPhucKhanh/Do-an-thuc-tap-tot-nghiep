import { Request, Response } from 'express';
import * as campaignService from '../services/campaign.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

// 🌟 HÀM NỘI BỘ: Tính khoảng cách Haversine giữa tọa độ nơi ở SV và Địa điểm Chiến dịch (Đơn vị: km)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10; // Làm tròn lấy 1 chữ số thập phân (Ví dụ: 3.5 km)
};

// API: Tạo chiến dịch mới
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const payload = {
            ...req.body,
            requiredVolunteers: parseInt(req.body.requiredVolunteers, 10),
            categoryId: req.body.categoryId ? parseInt(req.body.categoryId, 10) : null,
            // Ép kiểu tọa độ Float nếu Admin có truyền lên khi tạo
            lat: req.body.lat ? parseFloat(req.body.lat) : null,
            lng: req.body.lng ? parseFloat(req.body.lng) : null,
            image: imageUrl
        };

        const newCampaign = await campaignService.createCampaign(payload);

        res.status(201).json({
            message: "Tạo chiến dịch tình nguyện thành công!",
            data: newCampaign
        });
    } catch (error: any) {
        res.status(400).json({ error: "Lỗi khi tạo chiến dịch: " + error.message });
    }
};

// API: Lấy danh sách tất cả chiến dịch (Có hỗ trợ bộ lọc query ?type=)
// API: Lấy danh sách tất cả chiến dịch (Hỗ trợ bộ lọc ?type= và Phân trang ?page=&limit=)
export const getAll = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type } = req.query;
        
        // 🌟 LẤY THAM SỐ PHÂN TRANG TỪ QUERY (Mặc định trang 1, mỗi trang 5 cái theo giao diện admin)
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 5;
        const skip = (page - 1) * limit;

        let whereCondition: any = {};
        if (type) {
            if (type === 'org') whereCondition.type = 'ORGANIZATION';
            else if (type === 'ind') whereCondition.type = 'INDIVIDUAL';
            else whereCondition.type = type as any;
        }

        // 🌟 ĐỒNG THỜI LẤY DỮ LIỆU PHÂN TRANG VÀ ĐẾM TỔNG SỐ BÀI TRONG DB
        const [campaigns, totalCampaigns] = await Promise.all([
            prisma.campaign.findMany({
                where: whereCondition,
                skip: skip, // Bỏ qua các bản ghi trang trước
                take: limit, // Lấy đúng số lượng quy định
                include: {
                    _count: {
                        select: { registrations: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.campaign.count({ where: whereCondition })
        ]);

        // Format lại dữ liệu trả về cho Frontend
        const formattedCampaigns = campaigns.map((camp: any) => ({
            ...camp,
            currentVolunteers: camp._count.registrations
        }));

        // Trả về kèm thông tin phân trang để Frontend vẽ nút bấm
        res.status(200).json({ 
            data: formattedCampaigns,
            pagination: {
                totalItems: totalCampaigns,
                totalPages: Math.ceil(totalCampaigns / limit),
                currentPage: page,
                limit: limit
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chiến dịch:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tải dữ liệu." });
    }
};

// API: Lấy danh sách sinh viên đăng ký của 1 chiến dịch
export const getRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const campaignId = parseInt(req.params.id as string, 10);

        if (isNaN(campaignId)) {
            res.status(400).json({ error: "ID chiến dịch không hợp lệ!" });
            return;
        }

        const registrations = await campaignService.getRegistrationsByCampaign(campaignId);
        res.status(200).json({
            message: "Lấy danh sách đăng ký thành công!",
            data: registrations
        });
    } catch (error: any) {
        res.status(500).json({ error: "Lỗi server: " + error.message });
    }
};

// API: Cập nhật thông tin chiến dịch
// API: Cập nhật thông tin chiến dịch (Hỗ trợ upload sửa cả hình ảnh mới)
export const update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) { res.status(400).json({ error: "ID không hợp lệ" }); return; }

        // 🌟 1. KIỂM TRA NẾU ADMIN CÓ UPLOAD FILE ẢNH MỚI
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

        // 🌟 2. GOM CÁC TRƯỜNG DỮ LIỆU CŨ VÀ ÉP KIỂU TỪ FORMDATA TRUYỀN LÊN
        const payload: any = {
            ...req.body,
            requiredVolunteers: req.body.requiredVolunteers ? parseInt(req.body.requiredVolunteers, 10) : undefined,
            categoryId: req.body.categoryId ? parseInt(req.body.categoryId, 10) : undefined,
            lat: req.body.lat ? parseFloat(req.body.lat) : undefined,
            lng: req.body.lng ? parseFloat(req.body.lng) : undefined,
        };

        // Nếu có ảnh mới thì gán đường dẫn mới vào payload để lưu xuống MySQL
        if (imageUrl) {
            payload.image = imageUrl;
        }

        const updated = await campaignService.updateCampaign(id, payload);
        res.status(200).json({ message: "Cập nhật thành công!", data: updated });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// API: Xóa chiến dịch
export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) { res.status(400).json({ error: "ID không hợp lệ" }); return; }

        await campaignService.deleteCampaign(id);
        res.status(200).json({ message: "Xóa chiến dịch thành công!" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// API: Lấy chi tiết 1 chiến dịch theo ID
export const getCampaignById = async (req: Request, res: Response): Promise<any> => {
    try {
        const campaignId = parseInt(req.params.id as string, 10);

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign) {
            return res.status(404).json({ error: "Không tìm thấy chiến dịch!" });
        }

        res.status(200).json({ data: campaign });
    } catch (error) {
        console.error("Lỗi lấy chi tiết chiến dịch:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tải chi tiết chiến dịch." });
    }
};

// API: Lấy số liệu thống kê tổng hợp của hệ thống (Số thật 100%)
export const getSystemStats = async (req: Request, res: Response) => {
    try {
        const [totalUsers, totalCampaigns, totalRegistrations, totalOrgs, totalIndiv] = await Promise.all([
            prisma.user.count(),
            prisma.campaign.count(),
            prisma.registration.count({ where: { status: 'APPROVED' } }),
            prisma.campaign.count({ where: { type: 'ORGANIZATION' } }),
            prisma.campaign.count({ where: { type: 'INDIVIDUAL' } }),
        ]);

        res.status(200).json({
            data: {
                totalUsers: totalUsers,
                totalCampaigns,
                totalRegistrations,
                totalOrgs,
                totalIndiv,
                year: 2026
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy thống kê" });
    }
};

// API Lấy dữ liệu Bảng xếp hạng thi đua thật giữa các Khoa
export const getFacultyLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        // Lấy tất cả các đơn đăng ký đã được duyệt thành công kèm thông tin Khoa của Sinh viên
        const approvedRegistrations = await prisma.registration.findMany({
            where: { status: 'APPROVED' },
            include: {
                user: {
                    select: { faculty: true }
                }
            }
        });

        // Khởi tạo Object dùng để nhóm và đếm số lượt tham gia của từng Khoa
        const facultyCounts: { [key: string]: number } = {};

        approvedRegistrations.forEach(reg => {
            const facultyName = reg.user?.faculty?.name || 'Khoa khác';
            facultyCounts[facultyName] = (facultyCounts[facultyName] || 0) + 1;
        });

        // Chuyển Object thành mảng Array cấu trúc [{ faculty, count }] và sắp xếp giảm dần từ cao xuống thấp
        const leaderboard = Object.keys(facultyCounts).map(faculty => ({
            faculty,
            count: facultyCounts[faculty]
        })).sort((a, b) => b.count - a.count);

        res.status(200).json({ data: leaderboard });
    } catch (error: any) {
        console.error("Lỗi tính toán bảng xếp hạng:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tính toán bảng xếp hạng thi đua." });
    }
};

// 🌟 THÊM MỚI API: Lọc và tính khoảng cách chiến dịch gần nhất dựa theo tọa độ SV lưu trú
export const getNearestCampaigns = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        // 1. Tìm thông tin tọa độ nơi ở hiện tại của Sinh viên
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId as string, 10) }
        });

        if (!user || !user.lat || !user.lng) {
            return res.status(400).json({ 
                error: 'Tài khoản sinh viên chưa cập nhật tọa độ vị trí hoặc địa chỉ lưu trú hiện tại!' 
            });
        }

        // 2. Lấy danh sách toàn bộ các chiến dịch và số lượng đơn tình nguyện đã tham gia
        const campaigns = await prisma.campaign.findMany({
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        // 3. Lọc các chiến dịch có tọa độ thực tế và áp dụng công thức Haversine tính km
        const campaignsWithDistance = campaigns
            .filter(camp => camp.lat !== null && camp.lng !== null)
            .map((camp: any) => {
                const distance = calculateDistance(
                    user.lat!, 
                    user.lng!, 
                    camp.lat!, 
                    camp.lng!
                );
                return { 
                    ...camp, 
                    currentVolunteers: camp._count.registrations,
                    distanceKm: distance 
                };
            });

        // 4. Sắp xếp danh sách ưu tiên từ khoảng cách gần nhất cho tới xa nhất
        campaignsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

        res.status(200).json({
            success: true,
            userAddress: user.address,
            data: campaignsWithDistance
        });
    } catch (error) {
        console.error('Lỗi getNearestCampaigns:', error);
        res.status(500).json({ error: 'Lỗi hệ thống khi phân tích khoảng cách vị trí gần nhất.' });
    }
};

// ================= CÁC API DÀNH CHO QUYÊN GÓP VẬT PHẨM =================

// 1. Sinh viên đăng ký quyên góp vật phẩm
export const donateItems = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const campaignId = parseInt(req.params.id as string, 10);
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Bạn cần đăng nhập để quyên góp!" });
            return;
        }

        const { type, quantity, date, note } = req.body;

        const newDonation = await prisma.itemDonation.create({
            data: {
                campaignId,
                userId,
                type,
                quantity,
                date,
                note
            }
        });

        res.status(201).json({ message: "Ghi nhận quyên góp thành công!", data: newDonation });
    } catch (error: any) {
        console.error("Lỗi quyên góp vật phẩm:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi lưu thông tin quyên góp." });
    }
};

// 2. Admin lấy toàn bộ danh sách quyên góp để quản lý
export const getAllDonations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donations = await prisma.itemDonation.findMany({
            include: {
                user: { 
                    select: { fullName: true, phone: true, studentId: true, faculty: { select: { name: true } } } 
                },
                campaign: { 
                    select: { title: true } 
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ data: donations });
    } catch (error: any) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách quyên góp vật phẩm." });
    }
};

// 3. Admin cập nhật trạng thái (Từ PENDING -> RECEIVED)
export const updateDonationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donationId = parseInt(req.params.id as string, 10);
        const { status } = req.body; 

        const updated = await prisma.itemDonation.update({
            where: { id: donationId },
            data: { status }
        });

        res.status(200).json({ message: "Đã xác nhận nhận vật phẩm thành công!", data: updated });
    } catch (error: any) {
        res.status(500).json({ error: "Lỗi khi cập nhật trạng thái quyên góp." });
    }
};