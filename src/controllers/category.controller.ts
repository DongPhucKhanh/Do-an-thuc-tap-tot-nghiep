import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { campaigns: true } } } 
        });
        res.status(200).json({ data: categories });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo danh mục mới (Dành cho Admin)
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const category = await prisma.category.create({
            data: { name, description }
        });
        res.status(201).json({ message: "Tạo danh mục thành công!", data: category });
    } catch (error: any) {
        res.status(400).json({ error: "Lỗi tạo danh mục (Tên có thể đã tồn tại)" });
    }
};

// Xóa danh mục (Dành cho Admin)
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Xóa danh mục thành công!" });
    } catch (error: any) {
        res.status(500).json({ error: "Không thể xóa danh mục đang có chiến dịch" });
    }
};