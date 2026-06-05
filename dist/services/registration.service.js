"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegistrationStatus = exports.applyForCampaign = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const applyForCampaign = async (userId, campaignId) => {
    // 1. Kiểm tra xem chiến dịch có tồn tại và đang mở không
    const campaign = await prisma_1.default.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign)
        throw new Error("Chiến dịch không tồn tại!");
    if (campaign.status !== 'OPEN')
        throw new Error("Chiến dịch này đã đóng đăng ký!");
    const existingReg = await prisma_1.default.registration.findFirst({
        where: { userId: userId, campaignId: campaignId }
    });
    if (existingReg)
        throw new Error("Bạn đã đăng ký tham gia chiến dịch này rồi!");
    return await prisma_1.default.registration.create({
        data: {
            userId: userId,
            campaignId: campaignId,
            status: 'PENDING' // Trạng thái mặc định là Chờ duyệt
        }
    });
};
exports.applyForCampaign = applyForCampaign;
// Hàm dành cho Admin: Cập nhật trạng thái đơn đăng ký
const updateRegistrationStatus = async (regId, newStatus) => {
    const existingReg = await prisma_1.default.registration.findUnique({
        where: { id: regId }
    });
    if (!existingReg)
        throw new Error("Không tìm thấy đơn đăng ký này!");
    return await prisma_1.default.registration.update({
        where: { id: regId },
        data: { status: newStatus }
    });
};
exports.updateRegistrationStatus = updateRegistrationStatus;
