"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.getUserProfile = exports.loginUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Tạo người dùng mới (Đăng ký)
const createUser = async (data) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
    return await prisma_1.default.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            fullName: data.fullName,
            role: 'VOLUNTEER',
            facultyId: data.facultyId ? parseInt(data.facultyId, 10) : null,
            // 👇 4 TRƯỜNG MỚI BỔ SUNG VÀO ĐÂY
            phone: data.phone || null,
            dob: data.dob || null,
            gender: data.gender || null,
            address: data.address || null
        }
    });
};
exports.createUser = createUser;
// Đăng nhập
const loginUser = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (!user)
        throw new Error("Email không tồn tại trong hệ thống!");
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid)
        throw new Error("Sai mật khẩu!");
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return {
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        },
        token
    };
};
exports.loginUser = loginUser;
// Hàm lấy thông tin cá nhân (Profile)
const getUserProfile = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            createdAt: true,
            faculty: true,
            // 👇 LẤY THÊM THÔNG TIN ĐỂ HIỂN THỊ LÊN TRANG CÁ NHÂN
            phone: true,
            dob: true,
            gender: true,
            address: true
        }
    });
    if (!user)
        throw new Error("Không tìm thấy người dùng!");
    return user;
};
exports.getUserProfile = getUserProfile;
// Lấy danh sách toàn bộ người dùng 
const getAllUsers = async () => {
    return await prisma_1.default.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            faculty: true,
            // 👇 ĐỂ ADMIN CÓ THỂ XEM SĐT LIÊN LẠC TÌNH NGUYỆN VIÊN
            phone: true,
            gender: true
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getAllUsers = getAllUsers;
// Đổi quyền người dùng
const updateUserRole = async (userId, newRole) => {
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: { role: newRole }
    });
};
exports.updateUserRole = updateUserRole;
// Xóa tài khoản
const deleteUser = async (userId) => {
    // RẤT QUAN TRỌNG: Phải xóa các đơn đăng ký của user này trước để tránh lỗi khóa ngoại (Foreign Key)
    await prisma_1.default.registration.deleteMany({
        where: { userId: userId }
    });
    // Sau đó mới xóa user
    return await prisma_1.default.user.delete({
        where: { id: userId }
    });
};
exports.deleteUser = deleteUser;
