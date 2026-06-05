"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// 1. API: Lấy tất cả bài viết tin tức (Hỗ trợ phân trang an toàn 100% không lỗi TS)
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 6;
        const skip = (page - 1) * limit;
        const [posts, totalPosts] = await Promise.all([
            prisma_1.default.post.findMany({
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.post.count()
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllPosts = getAllPosts;
// 2. API: Lấy chi tiết 1 bài viết theo ID
const getPostById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id))
            return res.status(400).json({ error: "ID không hợp lệ" });
        const post = await prisma_1.default.post.findUnique({ where: { id } });
        if (!post)
            return res.status(404).json({ error: "Không tìm thấy bài viết!" });
        res.status(200).json({ data: post });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPostById = getPostById;
// 3. API: Tạo bài viết tin tức mới (ĐÃ SỬA THÀNH TRƯỜNG IMAGE)
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        // Đường dẫn ảnh tạm nạp từ Multer
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-news.jpg';
        const newPost = await prisma_1.default.post.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPost = createPost;
// 4. API: Chỉnh sửa nội dung và hình ảnh bài viết (ĐÃ SỬA THÀNH TRƯỜNG IMAGE)
const updatePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id))
            return res.status(400).json({ error: "ID không hợp lệ" });
        const { title, content } = req.body;
        const updateData = { title, content };
        // Nếu admin chọn upload tệp ảnh mới thì bắn vào trường 'image'
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`; // 🌟 ĐÃ SỬA: Khớp chuẩn tên cột trong MySQL
        }
        const updatedPost = await prisma_1.default.post.update({
            where: { id },
            data: updateData
        });
        res.status(200).json({
            message: "Cập nhật bài viết thành công!",
            data: updatedPost
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePost = updatePost;
// 5. API: Gỡ bỏ bài viết khỏi hệ thống
const deletePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id))
            return res.status(400).json({ error: "ID không hợp lệ" });
        await prisma_1.default.post.delete({ where: { id } });
        res.status(200).json({ message: "Đã gỡ bài viết thành công!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deletePost = deletePost;
