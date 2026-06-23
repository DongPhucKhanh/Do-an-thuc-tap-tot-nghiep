import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo trạm phát sóng gửi mail bằng Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// 1. HÀM GỬI OTP LÚC ĐĂNG KÝ (Giao diện Xanh lá - Thân thiện, chào mừng)
export const sendVerificationEmail = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: `"Hệ Thống Tình Nguyện" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: '✅ Xác thực tài khoản đăng ký',
            html: `
                <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background-color: #059669; padding: 25px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">XÁC THỰC TÀI KHOẢN</h1>
                        </div>
                        
                        <div style="padding: 35px 30px;">
                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Xin chào,</p>
                            <p style="color: #4b5563; font-size: 15px;">Cảm ơn bạn đã đăng ký tham gia <strong>Hệ thống Quản lý Tình nguyện viên</strong>. Để hoàn tất quá trình đăng ký và kích hoạt tài khoản, vui lòng sử dụng mã xác thực (OTP) dưới đây:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; padding: 15px 40px; background-color: #ecfdf5; border: 2px dashed #34d399; border-radius: 8px;">
                                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #047857;">${otp}</span>
                                </div>
                            </div>
                            
                            <p style="color: #4b5563; font-size: 15px;"><em>Lưu ý:</em> Mã xác thực này chỉ có hiệu lực trong vòng <strong>5 phút</strong>.</p>
                            <p style="color: #4b5563; font-size: 15px; margin-bottom: 0;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn được an toàn.</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Email này được gửi tự động từ Hệ thống Quản lý Tình nguyện viên.</p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Vui lòng không trả lời lại (Do not reply) email này.</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi OTP Xác thực tài khoản đến ${email}`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};

// 2. HÀM GỬI OTP LÚC QUÊN MẬT KHẨU (Giao diện Đỏ/Cam - Cảnh báo, bảo mật)
export const sendForgotPasswordEmail = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from: `"Hệ Thống Tình Nguyện" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔒 Mã xác nhận khôi phục mật khẩu',
            html: `
                <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background-color: #dc2626; padding: 25px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">YÊU CẦU ĐẶT LẠI MẬT KHẨU</h1>
                        </div>
                        
                        <div style="padding: 35px 30px;">
                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Xin chào,</p>
                            <p style="color: #4b5563; font-size: 15px;">Chúng tôi vừa nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với địa chỉ email này. Để thiết lập lại mật khẩu mới, vui lòng nhập mã bảo mật dưới đây:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; padding: 15px 40px; background-color: #fef2f2; border: 2px dashed #f87171; border-radius: 8px;">
                                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #b91c1c;">${otp}</span>
                                </div>
                            </div>
                            
                            <p style="color: #ef4444; font-size: 14px; font-weight: bold;">⚠️ CẢNH BÁO BẢO MẬT:</p>
                            <ul style="color: #4b5563; font-size: 14px; padding-left: 20px; margin-top: 5px;">
                                <li>Mã xác thực này sẽ hết hạn sau <strong>5 phút</strong>.</li>
                                <li><strong>Tuyệt đối không chia sẻ</strong> mã này cho bất kỳ ai (kể cả quản trị viên).</li>
                            </ul>
                            <p style="color: #4b5563; font-size: 15px; margin-bottom: 0; margin-top: 20px;">Nếu bạn không yêu cầu đổi mật khẩu, có thể ai đó đang cố truy cập tài khoản của bạn. Vui lòng phớt lờ email này.</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Email này được gửi tự động từ Hệ thống Quản lý Tình nguyện viên.</p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">Vui lòng không trả lời lại (Do not reply) email này.</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi OTP Khôi phục mật khẩu đến ${email}`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};
// 3. HÀM GỬI EMAIL THÔNG BÁO DUYỆT ĐƠN TÌNH NGUYỆN (Giao diện Xanh dương - Thông báo trang trọng)
export const sendCampaignApprovalEmail = async (email: string, volunteerName: string, campaignName: string, time: string, location: string) => {
    try {
        await transporter.sendMail({
            from: `"Ban Tổ Chức Chiến Dịch" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎉 Chúc mừng! Bạn đã được chọn tham gia ${campaignName}`,
            html: `
                <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background-color: #2563eb; padding: 25px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">THÔNG BÁO KẾT QUẢ XÉT DUYỆT</h1>
                        </div>
                        
                        <div style="padding: 35px 30px;">
                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Thân gửi <strong>${volunteerName}</strong>,</p>
                            <p style="color: #4b5563; font-size: 15px;">Ban tổ chức trân trọng thông báo: Đơn đăng ký tình nguyện của bạn đã được <strong>XÉT DUYỆT THÀNH CÔNG</strong>. Chào mừng bạn chính thức gia nhập đội hình tình nguyện viên của chiến dịch:</p>
                            
                            <div style="margin: 25px 0; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                                <h2 style="color: #1e3a8a; font-size: 18px; margin-top: 0; margin-bottom: 15px;">${campaignName}</h2>
                                <p style="margin: 5px 0; color: #334155; font-size: 14px;">⏰ <strong>Thời gian tập trung:</strong> ${time}</p>
                                <p style="margin: 5px 0; color: #334155; font-size: 14px;">📍 <strong>Địa điểm:</strong> ${location}</p>
                            </div>
                            
                            <p style="color: #4b5563; font-size: 15px;">Vui lòng có mặt đúng giờ, mặc trang phục lịch sự (khuyến khích áo Đoàn/Hội nếu có) và chuẩn bị tinh thần nhiệt huyết nhất nhé!</p>
                            <p style="color: #4b5563; font-size: 15px; margin-bottom: 0;">Nếu có bất kỳ thay đổi nào không thể tham gia, vui lòng hủy đăng ký trên hệ thống trước 24h để Ban tổ chức sắp xếp nhân sự thay thế.</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Tuổi trẻ cống hiến - Kết nối cộng đồng</p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">© Hệ thống Quản lý Tình nguyện viên</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi Thông báo duyệt đơn cho ${volunteerName} (${email})`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};
// 4. HÀM GỬI EMAIL THÔNG BÁO TỪ CHỐI ĐƠN TÌNH NGUYỆN (Giao diện Xám - Lịch sự, động viên)
export const sendCampaignRejectionEmail = async (email: string, volunteerName: string, campaignName: string) => {
    try {
        await transporter.sendMail({
            from: `"Ban Tổ Chức Chiến Dịch" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thông báo kết quả đăng ký tham gia ${campaignName}`,
            html: `
                <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background-color: #64748b; padding: 25px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">THÔNG BÁO KẾT QUẢ XÉT DUYỆT</h1>
                        </div>
                        
                        <div style="padding: 35px 30px;">
                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Thân gửi <strong>${volunteerName}</strong>,</p>
                            <p style="color: #4b5563; font-size: 15px;">Lời đầu tiên, Ban tổ chức xin chân thành cảm ơn sự quan tâm và tinh thần nhiệt huyết của bạn dành cho chiến dịch <strong>${campaignName}</strong>.</p>
                            <p style="color: #4b5563; font-size: 15px;">Tuy nhiên, do số lượng đơn đăng ký vượt quá số lượng cần thiết hoặc một số tiêu chí chưa phù hợp ở thời điểm hiện tại, chúng tôi rất tiếc phải thông báo chưa thể đồng hành cùng bạn trong chiến dịch lần này.</p>
                            <p style="color: #4b5563; font-size: 15px;">Mong bạn đừng buồn nhé! Sẽ còn rất nhiều chiến dịch và hoạt động ý nghĩa khác đang chờ bạn trên hệ thống. Hẹn gặp lại bạn ở những chương trình tiếp theo!</p>
                            <p style="color: #4b5563; font-size: 15px; margin-bottom: 0;">Chúc bạn nhiều sức khỏe và luôn giữ mãi ngọn lửa tình nguyện.</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Tuổi trẻ cống hiến - Kết nối cộng đồng</p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">© Hệ thống Quản lý Tình nguyện viên</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[EMAIL] Đã gửi Thông báo TỪ CHỐI đơn cho ${volunteerName} (${email})`);
    } catch (error) {
        console.error('[EMAIL ERROR]:', error);
    }
};

// 4. HÀM GỬI PHẢN HỒI LIÊN HỆ
export const sendContactReplyEmail = async (email: string, name: string, replyContent: string) => {
    try {
        await transporter.sendMail({
            from: `"Hệ Thống Tình Nguyện" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: '✅ Phản hồi yêu cầu liên hệ từ Quản trị viên',
            html: `
                <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background-color: #3b82f6; padding: 25px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">PHẢN HỒI LIÊN HỆ</h1>
                        </div>
                        
                        <div style="padding: 35px 30px;">
                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Xin chào <strong>${name}</strong>,</p>
                            <p style="color: #4b5563; font-size: 15px;">Chúng tôi đã nhận được tin nhắn liên hệ của bạn và xin gửi tới bạn phản hồi từ Ban Quản Trị:</p>
                            
                            <div style="padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 4px;">
                                <p style="color: #1e3a8a; font-size: 15px; margin: 0; white-space: pre-wrap;">${replyContent}</p>
                            </div>
                            
                            <p style="color: #4b5563; font-size: 15px; margin-bottom: 0;">Nếu bạn có bất kỳ thắc mắc nào khác, xin đừng ngần ngại liên hệ lại với chúng tôi.</p>
                            <p style="color: #4b5563; font-size: 15px;">Trân trọng,</p>
                            <p style="color: #4b5563; font-size: 15px; font-weight: bold;">Ban Quản Trị Hệ thống Tình Nguyện</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Email này được gửi tự động từ Hệ thống Quản lý Tình nguyện viên.</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[Email] Đã gửi email phản hồi liên hệ tới ${email}`);
    } catch (error) {
        console.error(`[Email Error] Lỗi gửi email phản hồi cho ${email}:`, error);
    }
};