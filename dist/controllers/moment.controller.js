"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareMoment = exports.likeMoment = exports.addComment = exports.createMoment = exports.getAllMoments = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllMoments = async (req, res) => {
    try {
        const moments = await prisma_1.default.moment.findMany({
            include: {
                user: { select: { fullName: true, role: true } },
                campaign: { select: { title: true } },
                media: true, // 🌟 THÊM DÒNG NÀY: Lấy toàn bộ danh sách ảnh/video của bài viết
                comments: {
                    include: { user: { select: { fullName: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.status(200).json({ success: true, data: moments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi nạp danh sách bảng tin' });
    }
};
exports.getAllMoments = getAllMoments;
// 2. Cập nhật hàm Tạo bài đăng (Xử lý lưu mảng req.files)
const createMoment = async (req, res) => {
    try {
        const { title, location, date, content, campaignId, userId } = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Vui lòng chọn ít nhất một hình ảnh hoặc video!' });
        }
        if (!title || !date) {
            return res.status(400).json({ error: 'Vui lòng điền tiêu đề và thời gian diễn ra!' });
        }
        // 🌟 SỬA TẠI ĐÂY: Kiểm tra và ép kiểu an toàn, tránh tuyệt đối bị dính NaN làm sập Prisma
        const parsedCampaignId = (campaignId && campaignId !== 'null' && campaignId !== 'undefined' && !isNaN(Number(campaignId)))
            ? parseInt(campaignId)
            : null;
        const parsedUserId = (userId && userId !== 'null' && userId !== 'undefined' && !isNaN(Number(userId)))
            ? parseInt(userId)
            : null;
        const mediaData = files.map(file => ({
            url: `/uploads/${file.filename}`,
            type: file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE'
        }));
        const newMoment = await prisma_1.default.moment.create({
            data: {
                title,
                location,
                content,
                date: new Date(date),
                campaignId: parsedCampaignId, // Sử dụng biến đã được bọc lọc an toàn
                userId: parsedUserId, // Sử dụng biến đã được bọc lọc an toàn
                media: {
                    create: mediaData
                }
            },
            include: { media: true }
        });
        res.status(201).json({ success: true, data: newMoment });
    }
    catch (error) {
        console.error('Lỗi createMoment:', error); // Dòng này sẽ in vết lỗi chi tiết tại terminal backend
        res.status(500).json({ error: 'Lỗi hệ thống khi đăng tải bài viết' });
    }
};
exports.createMoment = createMoment;
// POST /api/moments/:momentId/comments - Người dùng tương tác gửi bình luận mới
const addComment = async (req, res) => {
    try {
        const { momentId } = req.params;
        const { content, userId } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Nội dung bình luận không được để trống!' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Bạn cần đăng nhập để tham gia thảo luận!' });
        }
        const newComment = await prisma_1.default.comment.create({
            data: {
                content,
                // 🌟 Đã fix: Sử dụng 'as string' để triệt tiêu lỗi gạch đỏ string | string[] của Express
                momentId: parseInt(momentId),
                userId: parseInt(userId)
            },
            include: {
                user: {
                    select: { fullName: true } // Trả về kèm tên người dùng để frontend hiển thị ngay lập tức
                }
            }
        });
        res.status(201).json({
            success: true,
            data: newComment
        });
    }
    catch (error) {
        console.error('Lỗi addComment:', error);
        res.status(500).json({ error: 'Không thể xử lý bình luận vào lúc này' });
    }
};
exports.addComment = addComment;
// PATCH /api/moments/:momentId/like - Tăng hoặc giảm lượt thích thật trong DB
const likeMoment = async (req, res) => {
    try {
        const { momentId } = req.params;
        const { action } = req.body; // 'like' hoặc 'unlike'
        const updatedMoment = await prisma_1.default.moment.update({
            where: { id: parseInt(momentId) },
            data: {
                likes: action === 'like' ? { increment: 1 } : { decrement: 1 }
            }
        });
        res.status(200).json({ success: true, data: updatedMoment });
    }
    catch (error) {
        console.error('Lỗi likeMoment:', error);
        res.status(500).json({ error: 'Không thể tương tác thích bài viết' });
    }
};
exports.likeMoment = likeMoment;
// POST /api/moments/:momentId/share - Tăng số lượt chia sẻ thật trong DB
const shareMoment = async (req, res) => {
    try {
        const { momentId } = req.params;
        const updatedMoment = await prisma_1.default.moment.update({
            where: { id: parseInt(momentId) },
            data: {
                shares: { increment: 1 } // Cộng thêm 1 vào DB mỗi lần bấm
            }
        });
        res.status(200).json({ success: true, data: updatedMoment });
    }
    catch (error) {
        console.error('Lỗi shareMoment:', error);
        res.status(500).json({ error: 'Không thể chia sẻ bài viết' });
    }
};
exports.shareMoment = shareMoment;
