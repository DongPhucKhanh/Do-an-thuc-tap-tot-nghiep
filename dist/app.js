"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Import các phân hệ routes
const user_route_1 = __importDefault(require("./routes/user.route"));
const campaign_route_1 = __importDefault(require("./routes/campaign.route"));
const registration_route_1 = __importDefault(require("./routes/registration.route"));
const banner_route_1 = __importDefault(require("./routes/banner.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const faculty_route_1 = __importDefault(require("./routes/faculty.route"));
const stats_route_1 = __importDefault(require("./routes/stats.route"));
const moment_route_1 = __importDefault(require("./routes/moment.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const ai_route_1 = __importDefault(require("./routes/ai.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 🛡️ ĐẶT MIDDLEWARE CẤU HÌNH LÊN ĐẦU TRƯỚC KHI CHẠY ROUTE
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '100mb' })); // Đưa giới hạn 100mb lên đây để phủ toàn bộ hệ thống
app.use(express_1.default.urlencoded({ extended: true, limit: '100mb' }));
// Quản lý thư mục tĩnh chứa ảnh upload công khai
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// 🛣️ ĐỊNH TUYẾN TOÀN BỘ CÁC ROUTE API
app.use('/api/users', user_route_1.default);
app.use('/api/auth', user_route_1.default);
app.use('/api/campaigns', campaign_route_1.default);
app.use('/api/registrations', registration_route_1.default);
app.use('/api/banners', banner_route_1.default);
app.use('/api/categories', category_route_1.default);
app.use('/api/faculties', faculty_route_1.default);
app.use('/api/stats', stats_route_1.default);
app.use('/api/moments', moment_route_1.default);
app.use('/api/posts', post_route_1.default);
app.use('/api/payment', payment_route_1.default); // Link chuẩn: /api/payment/create-fake-pending
app.use('/api/ai', ai_route_1.default);
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API Hệ thống Điều phối Tình nguyện!');
});
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
