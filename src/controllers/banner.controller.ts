import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin thêm banner mới
export const createBanner = async (req: Request, res: Response) => {
    try {
        const { title, link } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const banner = await prisma.banner.create({
            data: { title, link, imageUrl }
        });
        res.status(201).json({ message: "Thêm banner thành công!", data: banner });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
};

// Lấy danh sách banner cho người dùng
export const getActiveBanners = async (req: Request, res: Response) => {
    try {
        const banners = await prisma.banner.findMany({ where: { active: true } });
        res.json({ data: banners });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
};
// Trong src/controllers/banner.controller.ts bổ sung:
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.banner.delete({ where: { id: Number(id) } });
        res.json({ message: "Đã xóa banner!" });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
};

// Trong src/routes/banner.route.ts bổ sung:
