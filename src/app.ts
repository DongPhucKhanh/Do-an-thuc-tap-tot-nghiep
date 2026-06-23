import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

// Import các phân hệ routes
import userRoutes from './routes/user.route'; 
import campaignRoutes from './routes/campaign.route';
import registrationRoutes from './routes/registration.route';
import bannerRoute from './routes/banner.route'; 
import categoryRoutes from './routes/category.route';
import facultyRoute from './routes/faculty.route'; 
import statsRoutes from './routes/stats.route';
import momentRoute from './routes/moment.route';
import postRoutes from './routes/post.route';
import paymentRoutes from './routes/payment.route';
import aiRoutes from './routes/ai.route';
import notificationRoutes from './routes/notification.route';
import contactRoutes from './routes/contact.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ ĐẶT MIDDLEWARE CẤU HÌNH LÊN ĐẦU TRƯỚC KHI CHẠY ROUTE
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Đưa giới hạn 100mb lên đây để phủ toàn bộ hệ thống
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Quản lý thư mục tĩnh chứa ảnh upload công khai
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 🛣️ ĐỊNH TUYẾN TOÀN BỘ CÁC ROUTE API
app.use('/api/users', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/banners', bannerRoute);
app.use('/api/categories', categoryRoutes); 
app.use('/api/faculties', facultyRoute);
app.use('/api/stats', statsRoutes);
app.use('/api/moments', momentRoute);
app.use('/api/posts', postRoutes);
app.use('/api/payment', paymentRoutes); // Link chuẩn: /api/payment/create-fake-pending
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Chào mừng bạn đến với API Hệ thống Điều phối Tình nguyện!');
});

// 🌟 KHỞI TẠO SERVER HTTP VÀ SOCKET.IO ĐỂ CHAT THỜI GIAN THỰC
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('🔌 Một người dùng kết nối:', socket.id);

    // Tham gia phòng chat của chiến dịch cụ thể
    socket.on('join_campaign', (campaignId) => {
        socket.join(`campaign_${campaignId}`);
        console.log(`✅ User ${socket.id} joined campaign_${campaignId}`);
    });

    // Nhận tin nhắn và lưu vào DB, sau đó broadcast
    socket.on('send_message', async (data) => {
        try {
            const { campaignId, senderId, content } = data;
            const prisma = require('./config/prisma').default;
            
            // Lưu tin nhắn xuống CSDL
            const msg = await prisma.chatMessage.create({
                data: { campaignId, senderId, content },
                include: { sender: { select: { id: true, fullName: true, avatar: true } } }
            });
            
            // Gửi lại tin nhắn cho tất cả mọi người trong phòng (bao gồm cả người gửi)
            io.to(`campaign_${campaignId}`).emit('receive_message', msg);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn Socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Người dùng ngắt kết nối:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});