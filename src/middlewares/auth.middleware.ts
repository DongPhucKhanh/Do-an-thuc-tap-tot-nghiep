import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng kiểu dữ liệu Request của Express để chứa thêm thông tin user
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Lấy token từ header của Request (Frontend sẽ gửi lên qua header 'Authorization')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Định dạng chuẩn: "Bearer <token>"

    if (!token) {
        res.status(401).json({ error: "Không tìm thấy Token. Vui lòng đăng nhập!" });
        return;
    }

    try {
        // Giải mã token xem có hợp lệ không (dùng secret key trong file .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        
        req.user = decoded; 
        
        // Cho phép đi tiếp vào Controller
        next(); 
    } catch (error) {
        res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (role === 'ADMIN' || role === 'ORGANIZATION') {
        next(); 
    } else {
        res.status(403).json({ error: "Bạn không có quyền hạn (Chỉ Admin/Tổ chức mới được phép)!" });
    }
};