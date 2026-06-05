import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy danh sách tất cả các khoa
export const getAllFaculties = async (req: Request, res: Response) => {
    try {
        const faculties = await prisma.faculty.findMany({
            orderBy: { name: 'asc' } // Sắp xếp theo bảng chữ cái A-Z
        });
        res.status(200).json({ data: faculties });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Admin thêm khoa mới
export const createFaculty = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const faculty = await prisma.faculty.create({ data: { name } });
        res.status(201).json({ message: "Thêm khoa thành công!", data: faculty });
    } catch (error: any) {
        res.status(400).json({ error: "Tên khoa có thể đã tồn tại!" });
    }
};
// Xóa Khoa
export const deleteFaculty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.faculty.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Xóa khoa thành công!" });
    } catch (error: any) {
        res.status(500).json({ error: "Không thể xóa khoa đang có sinh viên!" });
    }
};