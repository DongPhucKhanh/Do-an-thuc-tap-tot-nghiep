import prisma from '../config/prisma';

export const applyForCampaign = async (userId: number, campaignId: number) => {
    // 1. Kiểm tra xem chiến dịch có tồn tại và đang mở không
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new Error("Chiến dịch không tồn tại!");
    if (campaign.status !== 'OPEN') throw new Error("Chiến dịch này đã đóng đăng ký!");

    const existingReg = await prisma.registration.findFirst({
        where: { userId: userId, campaignId: campaignId }
    });
    if (existingReg) throw new Error("Bạn đã đăng ký tham gia chiến dịch này rồi!");

    return await prisma.registration.create({
        data: {
            userId: userId,
            campaignId: campaignId,
            status: 'PENDING' // Trạng thái mặc định là Chờ duyệt
        }
    });
};
// Hàm dành cho Admin: Cập nhật trạng thái đơn đăng ký
export const updateRegistrationStatus = async (regId: number, newStatus: 'APPROVED' | 'REJECTED') => {
    const existingReg = await prisma.registration.findUnique({
        where: { id: regId }
    });
    
    if (!existingReg) throw new Error("Không tìm thấy đơn đăng ký này!");

    return await prisma.registration.update({
        where: { id: regId },
        data: { status: newStatus }
    });
};