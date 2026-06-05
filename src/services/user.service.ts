import prisma from '../config/prisma';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

// Tạo người dùng mới (Đăng ký)
export const createUser = async (data: any) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return await prisma.user.create({
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

// Đăng nhập
export const loginUser = async (data: any) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });
    if (!user) throw new Error("Email không tồn tại trong hệ thống!");

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new Error("Sai mật khẩu!");

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1d' } 
    );

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

// Hàm lấy thông tin cá nhân (Profile)
export const getUserProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({
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
    
    if (!user) throw new Error("Không tìm thấy người dùng!");
    return user;
};

// Lấy danh sách toàn bộ người dùng 
export const getAllUsers = async () => {
    return await prisma.user.findMany({
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

// Đổi quyền người dùng
export const updateUserRole = async (userId: number, newRole: 'ADMIN' | 'VOLUNTEER') => {
    return await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });
};

// Xóa tài khoản
export const deleteUser = async (userId: number) => {
    // RẤT QUAN TRỌNG: Phải xóa các đơn đăng ký của user này trước để tránh lỗi khóa ngoại (Foreign Key)
    await prisma.registration.deleteMany({
        where: { userId: userId }
    });

    // Sau đó mới xóa user
    return await prisma.user.delete({
        where: { id: userId }
    });
};