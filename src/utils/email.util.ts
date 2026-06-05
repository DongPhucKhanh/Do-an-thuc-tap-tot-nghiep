import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Mẫu gửi mã OTP Quên Mật Khẩu
export const sendForgotPasswordEmail = async (email: string, otp: string) => {
    try {
        await resend.emails.send({
            from: 'Hệ Thống Thiện Nguyện <onboarding@resend.dev>',
            to: email, // Khi demo nhớ truyền đúng email sếp đăng ký Resend nhé
            subject: '🔒 Mã xác nhận khôi phục mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Khôi phục mật khẩu</h2>
                    <p>Chào bạn,</p>
                    <p>Hệ thống nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn. Đây là mã xác nhận (OTP) của bạn:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; padding: 15px; background: #e2e8f0; display: inline-block; border-radius: 8px;">
                        ${otp}
                    </div>
                    <p style="color: #64748b; font-size: 13px; margin-top: 20px;">Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi OTP đến ${email}`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};

// 2. Mẫu gửi Biên lai Quyên góp Thành công
export const sendDonationReceipt = async (email: string, name: string, amount: number, orderId: string) => {
    try {
        await resend.emails.send({
            from: 'Quỹ Thiện Nguyện <onboarding@resend.dev>',
            to: email,
            subject: '❤️ Cảm ơn tấm lòng vàng của bạn!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 10px;">
                    <h2 style="color: #10b981;">Xác nhận quyên góp thành công!</h2>
                    <p>Kính gửi <b>${name}</b>,</p>
                    <p>Hệ thống đã ghi nhận số tiền quyên góp của bạn. Dưới đây là chi tiết biên lai:</p>
                    <ul>
                        <li><b>Mã giao dịch:</b> ${orderId}</li>
                        <li><b>Số tiền:</b> <span style="color: #ea580c; font-weight: bold;">${amount.toLocaleString('vi-VN')} VNĐ</span></li>
                        <li><b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}</li>
                    </ul>
                    <p>Sự đóng góp của bạn sẽ giúp đỡ được rất nhiều hoàn cảnh khó khăn. Chúc bạn thật nhiều sức khỏe!</p>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi biên lai đến ${email}`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};
// Thêm hàm này vào file email.util.ts
export const sendVerificationEmail = async (email: string, otp: string) => {
    try {
        await resend.emails.send({
            from: 'Hệ Thống Thiện Nguyện <onboarding@resend.dev>',
            to: email, // Khi demo nhớ nhập email mày dùng đăng ký Resend nhé
            subject: '✅ Xác thực tài khoản của bạn',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
                    <h2 style="color: #059669;">Chào mừng bạn đến với Hệ thống!</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng nhập mã xác nhận dưới đây:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; padding: 15px; background: #e2e8f0; display: inline-block; border-radius: 8px;">
                        ${otp}
                    </div>
                    <p style="color: #64748b; font-size: 13px; margin-top: 20px;">Mã này sẽ hết hạn sau 5 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi OTP Xác thực tài khoản đến ${email}`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};