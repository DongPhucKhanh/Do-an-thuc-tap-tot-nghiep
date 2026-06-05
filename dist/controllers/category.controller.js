"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getAllCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { campaigns: true } } }
        });
        res.status(200).json({ data: categories });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllCategories = getAllCategories;
// Tạo danh mục mới (Dành cho Admin)
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma.category.create({
            data: { name, description }
        });
        res.status(201).json({ message: "Tạo danh mục thành công!", data: category });
    }
    catch (error) {
        res.status(400).json({ error: "Lỗi tạo danh mục (Tên có thể đã tồn tại)" });
    }
};
exports.createCategory = createCategory;
// Xóa danh mục (Dành cho Admin)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Xóa danh mục thành công!" });
    }
    catch (error) {
        res.status(500).json({ error: "Không thể xóa danh mục đang có chiến dịch" });
    }
};
exports.deleteCategory = deleteCategory;
