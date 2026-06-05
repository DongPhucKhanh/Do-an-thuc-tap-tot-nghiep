import prisma from '../config/prisma';

export const createCampaign = async (data: any) => {
    return await prisma.campaign.create({
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

export const getAllCampaigns = async () => {
    return await prisma.campaign.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const getRegistrationsByCampaign = async (campaignId: number) => {
    return await prisma.registration.findMany({
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

// Cập nhật thông tin chiến dịch (bao gồm cả Tạm dừng/Mở lại)
export const updateCampaign = async (id: number, data: any) => {
    return await prisma.campaign.update({
        where: { id },
        data: data
    });
};

// Xóa chiến dịch
export const deleteCampaign = async (id: number) => {
    // ⚠️ Rất quan trọng: Phải xóa hết đơn đăng ký của chiến dịch này trước (tránh lỗi khóa ngoại)
    await prisma.registration.deleteMany({
        where: { campaignId: id }
    });

    // Sau đó mới xóa chiến dịch
    return await prisma.campaign.delete({
        where: { id }
    });
};