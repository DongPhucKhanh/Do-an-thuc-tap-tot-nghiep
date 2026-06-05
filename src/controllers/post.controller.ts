import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// 1. API: Lấy tất cả bài viết tin tức (Hỗ trợ phân trang an toàn 100% không lỗi TS)
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 6; 
        const skip = (page - 1) * limit;

        const [posts, totalPosts] = await Promise.all([
            prisma.post.findMany({
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.post.count()
        ]);

        res.status(200).json({ 
            data: posts,
            pagination: {
                totalItems: totalPosts,
                totalPages: Math.ceil(totalPosts / limit),
                currentPage: page,
                limit: limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 2. API: Lấy chi tiết 1 bài viết theo ID
export const getPostById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ" });

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "Không tìm thấy bài viết!" });

        res.status(200).json({ data: post });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 3. API: Tạo bài viết tin tức mới (ĐÃ SỬA THÀNH TRƯỜNG IMAGE)
export const createPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { title, content } = req.body;
        
        // Đường dẫn ảnh tạm nạp từ Multer
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-news.jpg';

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                image: fileUrl, // 🌟 ĐÃ SỬA: Đổi từ 'imageUrl' sang 'image' cho khớp model Prisma của sếp
            }
        });

        res.status(201).json({
            message: "Xuất bản bài viết tin tức thành công!",
            data: newPost
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 4. API: Chỉnh sửa nội dung và hình ảnh bài viết (ĐÃ SỬA THÀNH TRƯỜNG IMAGE)
export const updatePost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ" });

        const { title, content } = req.body;
        const updateData: any = { title, content };

        // Nếu admin chọn upload tệp ảnh mới thì bắn vào trường 'image'
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`; // 🌟 ĐÃ SỬA: Khớp chuẩn tên cột trong MySQL
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            message: "Cập nhật bài viết thành công!",
            data: updatedPost
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 5. API: Gỡ bỏ bài viết khỏi hệ thống
export const deletePost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ" });

        await prisma.post.delete({ where: { id } });
        res.status(200).json({ message: "Đã gỡ bài viết thành công!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};