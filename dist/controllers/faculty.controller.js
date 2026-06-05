"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaculty = exports.createFaculty = exports.getAllFaculties = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Lấy danh sách tất cả các khoa
const getAllFaculties = async (req, res) => {
    try {
        const faculties = await prisma.faculty.findMany({
            orderBy: { name: 'asc' } // Sắp xếp theo bảng chữ cái A-Z
        });
        res.status(200).json({ data: faculties });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllFaculties = getAllFaculties;
// Admin thêm khoa mới
const createFaculty = async (req, res) => {
    try {
        const { name } = req.body;
        const faculty = await prisma.faculty.create({ data: { name } });
        res.status(201).json({ message: "Thêm khoa thành công!", data: faculty });
    }
    catch (error) {
        res.status(400).json({ error: "Tên khoa có thể đã tồn tại!" });
    }
};
exports.createFaculty = createFaculty;
// Xóa Khoa
const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.faculty.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Xóa khoa thành công!" });
    }
    catch (error) {
        res.status(500).json({ error: "Không thể xóa khoa đang có sinh viên!" });
    }
};
exports.deleteFaculty = deleteFaculty;
