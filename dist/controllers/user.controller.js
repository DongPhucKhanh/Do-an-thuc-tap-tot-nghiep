"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getUsersWithActivities = exports.removeUser = exports.updateRole = exports.getAll = exports.getProfile = exports.login = exports.registerUser = void 0;
const userService = __importStar(require("../services/user.service"));
const prisma_1 = __importDefault(require("../config/prisma"));
const registerUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({
            message: "Tạo tài khoản thành công!",
            data: newUser
        });
    }
    catch (error) {
        res.status(400).json({ error: "Lỗi khi tạo tài khoản (có thể email đã tồn tại)" });
    }
};
exports.registerUser = registerUser;
const login = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.login = login;
// ĐÃ NÂNG CẤP: Lấy profile kèm Khoa và toàn bộ Album ảnh Moments chuẩn Instagram
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                faculty: true,
                // 🌟 Lấy thêm danh sách bài đăng khoảnh khắc và tệp media để vẽ Grid Instagram
                moments: {
                    include: { media: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!userProfile) {
            res.status(404).json({ error: "Không tìm thấy người dùng!" });
            return;
        }
        // 🌟 Tính tổng số lượt tim tích lũy từ tất cả các bài đăng của sinh viên này
        const totalLikes = userProfile.moments.reduce((sum, current) => sum + current.likes, 0);
        const formattedData = {
            ...userProfile,
            faculty: userProfile.faculty?.name || '', // Ép tên Khoa ra thành chuỗi text cho Frontend dễ đọc
            totalPosts: userProfile.moments.length, // Tổng số bài viết hiển thị ở Header
            totalLikes: totalLikes // Tổng số tim thật tích lũy
        };
        res.status(200).json({
            message: "Lấy thông tin thành công!",
            data: formattedData
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProfile = getProfile;
const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            data: users
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
const updateRole = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { role } = req.body;
        if (isNaN(userId)) {
            res.status(400).json({ error: "ID không hợp lệ!" });
            return;
        }
        const updatedUser = await userService.updateUserRole(userId, role);
        res.status(200).json({
            message: "Cập nhật quyền thành công",
            data: updatedUser
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateRole = updateRole;
const removeUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ error: "ID không hợp lệ!" });
            return;
        }
        await userService.deleteUser(userId);
        res.status(200).json({ message: "Đã xóa tài khoản thành công!" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removeUser = removeUser;
const getUsersWithActivities = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            where: { role: 'VOLUNTEER' }, // Chỉ lấy sinh viên
            include: {
                faculty: true, // Lấy thông tin Khoa
                registrations: {
                    include: {
                        campaign: true // Lấy thông tin Chiến dịch trong từng đơn đăng ký
                    }
                }
            },
            orderBy: { fullName: 'asc' }
        });
        res.status(200).json({ data: users });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getUsersWithActivities = getUsersWithActivities;
// ĐÃ NÂNG CẤP: Xử lý cập nhật thông tin cá nhân kết hợp nạp ảnh Avatar và Tọa độ bản đồ
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, studentId, faculty, dob, gender, address } = req.body;
        // 🌟 1. Kiểm tra nếu sinh viên có đăng tải tệp tin Avatar mới từ Máy ảnh / Thư viện
        const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        // 🌟 2. Ép kiểu dữ liệu tọa độ địa lý truyền lên từ map
        const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
        const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;
        let connectFaculty = undefined;
        if (faculty && faculty.trim() !== "") {
            const facultyName = faculty.trim();
            let existingFaculty = await prisma_1.default.faculty.findUnique({
                where: { name: facultyName }
            });
            if (!existingFaculty) {
                existingFaculty = await prisma_1.default.faculty.create({
                    data: { name: facultyName }
                });
            }
            connectFaculty = { connect: { id: existingFaculty.id } };
        }
        // 🌟 3. Đóng gói và lưu thông tin cập nhật xuống MySQL Workbench
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                fullName,
                phone,
                studentId,
                faculty: connectFaculty,
                dob, // Ngày sinh
                gender: gender === "" ? null : gender, // Giới tính (Xử lý chuỗi rỗng thành null)
                address, // Địa chỉ lưu trú text
                lat, // Vĩ độ radar vị trí gần nhất
                lng, // Kinh độ radar vị trí gần nhất
                ...(avatarUrl && { avatar: avatarUrl }) // Chỉ cập nhật trường avatar nếu có file ảnh thật truyền lên
            }
        });
        res.status(200).json({
            message: "Cập nhật thông tin và hình ảnh đại diện thành công!",
            data: updatedUser
        });
    }
    catch (error) {
        console.error("Lỗi update profile:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi cập nhật thông tin." });
    }
};
exports.updateProfile = updateProfile;
