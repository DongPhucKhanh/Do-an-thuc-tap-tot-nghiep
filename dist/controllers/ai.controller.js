"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAssistant = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const openai_1 = __importDefault(require("openai"));
// 👇 Kết nối tới Ollama đang chạy ngầm trên máy bạn
const openai = new openai_1.default({
    baseURL: 'http://localhost:11434/v1', // Địa chỉ mặc định của Ollama
    apiKey: 'ollama', // Ollama chạy offline nên không cần key thật, cứ điền bừa là được
});
const askAssistant = async (req, res) => {
    try {
        const { question } = req.body;
        // 1. KÉO DỮ LIỆU TỪ DATABASE (Để AI biết số liệu thật của trường)
        const totalUsers = await prisma_1.default.user.count({ where: { role: 'VOLUNTEER' } });
        const totalCampaigns = await prisma_1.default.campaign.count();
        const pendingRegistrations = await prisma_1.default.registration.count({ where: { status: 'PENDING' } });
        const activeCampaigns = await prisma_1.default.campaign.findMany({ select: { title: true }, take: 5 });
        const campaignNames = activeCampaigns.map(c => c.title).join(', ');
        const faculties = await prisma_1.default.faculty.findMany({
            include: { _count: { select: { users: { where: { role: 'VOLUNTEER' } } } } }
        });
        const facultyStatsText = faculties.map(f => `- Khoa ${f.name}: ${f._count.users} sinh viên`).join('\n');
        // 2. TẠO LỜI NHẮC (PROMPT) NHẬP VAI CHO AI
        const systemPrompt = `
            Bạn là "Trợ lý ảo Đoàn Thanh Niên", phục vụ riêng cho Bí thư.
            Trả lời ngắn gọn, lịch sự bằng tiếng Việt dựa trên TOÀN BỘ SỐ LIỆU SAU ĐÂY:
            - Tổng SV tình nguyện: ${totalUsers} sinh viên.
            - Tổng chiến dịch: ${totalCampaigns} chiến dịch.
            - Đơn chờ duyệt: ${pendingRegistrations} đơn.
            - Các chiến dịch gần đây: ${campaignNames}.
            - Thống kê theo Khoa:
            ${facultyStatsText}
        `;
        // 3. GỌI XUỐNG MÁY CHỦ OLLAMA ĐỂ TRẢ LỜI
        const completion = await openai.chat.completions.create({
            model: "qwen2.5:1.5b", // 👈 Đúng tên model bạn đang chạy ngầm
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question }
            ],
            temperature: 0.3, // Để AI bám sát số liệu, hạn chế "chế" văn
        });
        const answer = completion.choices[0].message.content;
        res.status(200).json({ answer: answer });
    }
    catch (error) {
        console.error("Lỗi AI Local:", error);
        res.status(500).json({ error: "Lỗi kết nối với Trợ lý AI Offline. Hãy kiểm tra xem màn hình đen Ollama còn chạy không nhé!" });
    }
};
exports.askAssistant = askAssistant;
