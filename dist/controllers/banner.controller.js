"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.getActiveBanners = exports.createBanner = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Admin thêm banner mới
const createBanner = async (req, res) => {
    try {
        const { title, link } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const banner = await prisma.banner.create({
            data: { title, link, imageUrl }
        });
        res.status(201).json({ message: "Thêm banner thành công!", data: banner });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createBanner = createBanner;
// Lấy danh sách banner cho người dùng
const getActiveBanners = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({ where: { active: true } });
        res.json({ data: banners });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getActiveBanners = getActiveBanners;
// Trong src/controllers/banner.controller.ts bổ sung:
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.banner.delete({ where: { id: Number(id) } });
        res.json({ message: "Đã xóa banner!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteBanner = deleteBanner;
// Trong src/routes/banner.route.ts bổ sung:
