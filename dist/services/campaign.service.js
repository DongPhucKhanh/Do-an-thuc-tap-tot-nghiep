"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.getRegistrationsByCampaign = exports.getAllCampaigns = exports.createCampaign = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createCampaign = async (data) => {
    return await prisma_1.default.campaign.create({
        data: {
            title: data.title,
            description: data.description,
            location: data.location,
            image: data.image,
            requiredVolunteers: data.requiredVolunteers,
            categoryId: data.categoryId, // 👈 THÊM DÒNG NÀY: Để lưu Danh mục chiến dịch
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            type: data.type,
            status: 'OPEN'
        }
    });
};
exports.createCampaign = createCampaign;
const getAllCampaigns = async () => {
    return await prisma_1.default.campaign.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getAllCampaigns = getAllCampaigns;
const getRegistrationsByCampaign = async (campaignId) => {
    return await prisma_1.default.registration.findMany({
        where: {
            campaignId: campaignId
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    faculty: true // 👈 THÊM DÒNG NÀY: Để lấy kèm tên Khoa của Sinh viên
                }
            },
            tasks: true,
            evaluations: true
        },
        orderBy: {
            appliedAt: 'desc'
        }
    });
};
exports.getRegistrationsByCampaign = getRegistrationsByCampaign;
// Cập nhật thông tin chiến dịch (bao gồm cả Tạm dừng/Mở lại)
const updateCampaign = async (id, data) => {
    return await prisma_1.default.campaign.update({
        where: { id },
        data: data
    });
};
exports.updateCampaign = updateCampaign;
// Xóa chiến dịch
const deleteCampaign = async (id) => {
    // ⚠️ Rất quan trọng: Phải xóa hết đơn đăng ký của chiến dịch này trước (tránh lỗi khóa ngoại)
    await prisma_1.default.registration.deleteMany({
        where: { campaignId: id }
    });
    // Sau đó mới xóa chiến dịch
    return await prisma_1.default.campaign.delete({
        where: { id }
    });
};
exports.deleteCampaign = deleteCampaign;
