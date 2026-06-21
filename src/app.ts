import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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

app.get('/', (req: Request, res: Response) => {
    res.send('Chào mừng bạn đến với API Hệ thống Điều phối Tình nguyện!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});