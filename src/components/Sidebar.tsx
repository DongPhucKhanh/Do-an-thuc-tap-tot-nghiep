import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCheck,
    Layers,
    PlusCircle,
    Users,
    GraduationCap,
    ClipboardList,
    Activity,
    Target,
    History,
    Image as ImageIcon,
    Star,
    Image,
    Newspaper,
    QrCode,
    Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { palette } from '../styles/adminTheme';

export default function Sidebar() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        backgroundColor: isActive
            ? (isDark ? '#1e3a5f' : '#eff6ff')
            : 'transparent',
        color: isActive
            ? '#2563eb'
            : (isDark ? p.textSub : '#4b5563'),
        borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
        fontWeight: isActive ? 600 : 400,
        fontSize: '13.5px',
        transition: 'background-color 0.15s, color 0.15s',
    });

    return (
        <div style={{
            width: '240px',
            backgroundColor: p.sidebarBg,
            borderRight: `1px solid ${p.border}`,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
            flexShrink: 0,
            transition: 'background-color 0.2s, border-color 0.2s'
        }}>

            <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${p.border}`,
                fontWeight: 700,
                fontSize: '15px',
                color: p.text,
                letterSpacing: '0.3px'
            }}>
                Trang Quản trị
            </div>

            <div style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
                <p style={{
                    padding: '0 16px 6px 16px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: p.textFaint,
                    fontWeight: 600,
                    letterSpacing: '0.8px'
                }}>
                    Menu Quản lý
                </p>

                <NavLink to="/admin/dashboard" style={navStyle}><LayoutDashboard size={16} /> Tổng quan</NavLink>
                <NavLink to="/admin" end style={navStyle}><UserCheck size={16} /> Duyệt Tình nguyện viên</NavLink>
                <NavLink to="/admin/categories" style={navStyle}><Layers size={16} /> Quản lý Danh mục</NavLink>
                <NavLink to="/admin/create" style={navStyle}><PlusCircle size={16} /> Tạo Chiến dịch mới</NavLink>
                <NavLink to="/admin/users" style={navStyle}><Users size={16} /> Quản lý Tài khoản</NavLink>
                <NavLink to="/admin/faculties" style={navStyle}><GraduationCap size={16} /> Quản lý Khoa</NavLink>
                <NavLink to="/admin/campaigns" style={navStyle}><ClipboardList size={16} /> Quản lý Hoạt động</NavLink>
                <NavLink to="/admin/posts" style={navStyle}><Newspaper size={16} /> Quản lý Bài viết</NavLink>
                <NavLink to="/admin/student-activities" style={navStyle}><Activity size={16} /> Theo dõi HĐ Sinh viên</NavLink>
                <NavLink to="/admin/assignments" style={navStyle}><Target size={16} /> Điều phối Nhân sự</NavLink>
                <NavLink to="/admin/moments" style={navStyle}><Image size={16} /> Quản lý Khoảnh khắc</NavLink>
                <NavLink to="/admin/history" style={navStyle}><History size={16} /> Lịch sử Tình nguyện viên</NavLink>
                <NavLink to="/admin/banners" style={navStyle}><ImageIcon size={16} /> Quản lý Banner</NavLink>
                <NavLink to="/admin/donations" style={navStyle}><QrCode size={16} /> Quản lý Quyên góp QR</NavLink>
                <NavLink to="/admin/evaluations" style={navStyle}><Star size={16} /> Đánh giá Tình nguyện viên</NavLink>
                <NavLink to="/admin/contacts" style={navStyle}><Mail size={16} /> Quản lý Liên hệ</NavLink>
            </div>
        </div>
    );
}