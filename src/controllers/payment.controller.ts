import { Request, Response } from 'express';
import prisma from '../config/prisma';

// 🌟 1. API: Frontend gọi để đăng ký một mã giao dịch PENDING trước khi hiển thị QR
export const createFakePending = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ép kiểu ép phom chắc chắn orderId là string bằng từ khóa 'as string'
        const orderId = req.body.orderId as string;
        const { amount, campaignId, userId } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            res.status(400).json({ error: "Số tiền quyên góp không hợp lệ!" });
            return;
        }

        // Kiểm tra xem chiến dịch có tồn tại hay không
        const campaignExists = await prisma.campaign.findUnique({ where: { id: Number(campaignId) } });
        if (!campaignExists) {
            res.status(404).json({ error: "Không tìm thấy chiến dịch tình nguyện này!" });
            return;
        }

        // Lưu bản ghi lịch sử ở trạng thái CHỜ CHUYỂN KHOẢN
        const donation = await prisma.donation.create({
            data: {
                orderId: orderId, // Chuỗi sạch 100% TypeScript công nhận
                amount: Number(amount),
                campaignId: Number(campaignId),
                userId: userId ? Number(userId) : null,
                status: "PENDING"
            }
        });

        res.status(200).json({ success: true, message: "Khởi tạo hóa đơn chờ quét QR thành công.", data: donation });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 🌟 2. API WEBHOOK: Nhận biến động số dư ngân hàng thật từ Casso / SePay để cộng tiền tự động
export const cassoWebhookReceiver = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = req.body.data || (req.body.transactions ? req.body.transactions : [req.body]);

        if (!transactions || transactions.length === 0) {
            res.status(200).json({ error: 0, message: "Không có dữ liệu giao dịch." });
            return;
        }

        for (const txn of transactions) {
            // Bọc hàm String() để dập tắt hoàn toàn mọi nguy cơ trả về mảng chuỗi từ req.body thô
            const content = String(txn.description || txn.content || '').toUpperCase();
            const amountPaid = Number(txn.amount || txn.transferAmount || 0);

            const match = content.match(/DONATE\d+/);
            
            if (match) {
                const orderId = match[0]; // match[0] luôn trả về kiểu dữ liệu 'string' chuẩn chỉ

                const donation = await prisma.donation.findUnique({ where: { orderId } });

                if (donation && donation.status === "PENDING") {
                    await prisma.$transaction([
                        prisma.donation.update({
                            where: { orderId },
                            data: { status: 'SUCCESS' }
                        }),
                        prisma.campaign.update({
                            where: { id: donation.campaignId },
                            data: {
                                currentAmount: { increment: amountPaid }
                            }
                        })
                    ]);
                    
                    console.log(`[BANK REALTIME] 🎉 Đã tự động duyệt cộng tiền cho đơn hàng: ${orderId} (+${amountPaid}đ)`);
                }
            }
        }

        res.status(200).json({ error: 0, message: "Ghi nhận biến động số dư thành công!" });
    } catch (error: any) {
        console.error("[WEBHOOK ERROR]:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// 🌟 3. API: Frontend gọi liên tục để check xem đơn hàng đã được cộng tiền thành công chưa
export const checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        // 🛡️ CHỖ NÀY ĐƠN GIẢN NHƯNG LÀ NƠI DỄ GÂY LỖI: Ép kiểu dữ liệu orderId trích xuất từ params về string dứt điểm
        const orderId = req.params.orderId as string;

        const donation = await prisma.donation.findUnique({
            where: { orderId } // Hết gạch đỏ, Prisma nhận diện xanh mượt
        });

        if (!donation) {
            res.status(404).json({ error: "Không tìm thấy giao dịch!" });
            return;
        }

        res.status(200).json({ status: donation.status });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
export const forceSuccessPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;

        // 1. Tìm đơn hàng để lấy thông tin campaignId và amount thực tế
        const donation = await prisma.donation.findUnique({
            where: { orderId }
        });

        if (!donation) {
            res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
            return;
        }

        if (donation.status === 'SUCCESS') {
            res.status(200).json({ success: true, message: "Đơn đã được duyệt từ trước." });
            return;
        }

        // 2. Dùng Transaction để cộng tiền chính xác vào ĐÚNG chiến dịch
        await prisma.$transaction([
            prisma.donation.update({
                where: { orderId },
                data: { status: 'SUCCESS' }
            }),
            prisma.campaign.update({
                where: { id: donation.campaignId }, // Tự động lấy từ đơn hàng
                data: { currentAmount: { increment: donation.amount } } // Cộng đúng số tiền đã đăng ký
            })
        ]);

        console.log(`[FORCE SUCCESS] 🎉 Đã duyệt đơn ${orderId} cho campaign ${donation.campaignId}`);
        res.json({ success: true });
        
    } catch (error: any) {
        console.error("[FORCE SUCCESS ERROR]:", error);
        res.status(500).json({ error: error.message });
    }
};