import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware'; 
import { RequestHandler } from 'express';
import prisma from '../config/prisma';

// 🌟 THÊM 2 IMPORT NÀY CHO TÍNH NĂNG QUÊN MẬT KHẨU
import bcrypt from 'bcryptjs';
import { sendForgotPasswordEmail, sendVerificationEmail } from '../utils/email.util';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        
        // Gọi service tạo user của mày (Nhớ là nó sẽ lưu xuống DB)
        const newUser = await userService.createUser(req.body);

        // Tạo mã OTP 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Ép trạng thái isVerified = false và lưu mã OTP vào user vừa tạo
        await prisma.user.update({
            where: { email: email },
            data: { 
                isVerified: false,
                verifyOtp: otp, 
                verifyOtpExpires: expiresAt 
            }
        });

        // Bắn email OTP
        await sendVerificationEmail(email, otp);

        res.status(201).json({
            message: "Tạo tài khoản thành công! Vui lòng kiểm tra email để lấy mã xác thực.",
            data: newUser,
            requireOtp: true // Cờ báo cho Frontend biết cần chuyển sang màn hình nhập OTP
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Lỗi khi tạo tài khoản (có thể email đã tồn tại)" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await userService.loginUser(req.body);
        
        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: result.token, 
            user: result.user   
        });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

// ĐÃ NÂNG CẤP: Lấy profile kèm Khoa và toàn bộ Album ảnh Moments chuẩn Instagram
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; 
        
        const userProfile = await prisma.user.findUnique({
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
            totalLikes: totalLikes                  // Tổng số tim thật tích lũy
        };
        
        res.status(200).json({
            message: "Lấy thông tin thành công!",
            data: formattedData
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            data: users
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRole: RequestHandler = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id as string, 10);
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const removeUser: RequestHandler = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id as string, 10);
        if (isNaN(userId)) {
            res.status(400).json({ error: "ID không hợp lệ!" });
            return;
        }

        await userService.deleteUser(userId);
        res.status(200).json({ message: "Đã xóa tài khoản thành công!" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getUsersWithActivities = async (req: any, res: any): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// ĐÃ NÂNG CẤP: Xử lý cập nhật thông tin cá nhân kết hợp nạp ảnh Avatar và Tọa độ bản đồ
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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
            let existingFaculty = await prisma.faculty.findUnique({
                where: { name: facultyName }
            });
            
            if (!existingFaculty) {
                existingFaculty = await prisma.faculty.create({
                    data: { name: facultyName }
                });
            }
            connectFaculty = { connect: { id: existingFaculty.id } };
        }

        // 🌟 3. Đóng gói và lưu thông tin cập nhật xuống MySQL Workbench
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                fullName, 
                phone, 
                studentId, 
                faculty: connectFaculty,
                dob,                                   // Ngày sinh
                gender: gender === "" ? null : gender, // Giới tính (Xử lý chuỗi rỗng thành null)
                address,                               // Địa chỉ lưu trú text
                lat,                                   // Vĩ độ radar vị trí gần nhất
                lng,                                   // Kinh độ radar vị trí gần nhất
                ...(avatarUrl && { avatar: avatarUrl }) // Chỉ cập nhật trường avatar nếu có file ảnh thật truyền lên
            }
        });

        res.status(200).json({
            message: "Cập nhật thông tin và hình ảnh đại diện thành công!",
            data: updatedUser
        });
    } catch (error: any) {
        console.error("Lỗi update profile:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi cập nhật thông tin." });
    }
};


// =========================================================================================
// 🌟 TÍNH NĂNG MỚI: QUÊN MẬT KHẨU VÀ ĐẶT LẠI MẬT KHẨU QUA EMAIL (RESEND)
// =========================================================================================

// API 1: Yêu cầu gửi mã OTP vào Email
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ error: "Email không tồn tại trong hệ thống!" });
            return;
        }

        // Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hết hạn sau 5 phút
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Lưu vào DB
        await prisma.user.update({
            where: { email },
            data: { resetPasswordOtp: otp, resetPasswordExpires: expiresAt }
        });

        // Gửi OTP qua Resend
        await sendForgotPasswordEmail(user.email, otp);

        res.json({ success: true, message: "Đã gửi mã OTP đến email của bạn!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// API 2: Nhập mã OTP và Đổi Mật khẩu mới
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        // Kiểm tra mã OTP
        if (!user || user.resetPasswordOtp !== otp) {
            res.status(400).json({ error: "Mã OTP không chính xác!" });
            return;
        }

        // Kiểm tra hạn sử dụng của OTP
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            res.status(400).json({ error: "Mã OTP đã hết hạn!" });
            return;
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới và xóa dấu vết OTP cũ
        await prisma.user.update({
            where: { email },
            data: { 
                password: hashedPassword,
                resetPasswordOtp: null,
                resetPasswordExpires: null
            }
        });

        res.json({ success: true, message: "Đổi mật khẩu thành công! Hãy đăng nhập lại." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
export const verifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.verifyOtp !== otp) {
            res.status(400).json({ error: "Mã OTP không chính xác!" });
            return;
        }

        if (user.verifyOtpExpires && user.verifyOtpExpires < new Date()) {
            res.status(400).json({ error: "Mã OTP đã hết hạn!" });
            return;
        }

        // Cập nhật tài khoản thành Đã Xác Thực (isVerified = true) và dọn sạch OTP
        await prisma.user.update({
            where: { email },
            data: { 
                isVerified: true,
                verifyOtp: null,
                verifyOtpExpires: null
            }
        });

        res.json({ success: true, message: "Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};