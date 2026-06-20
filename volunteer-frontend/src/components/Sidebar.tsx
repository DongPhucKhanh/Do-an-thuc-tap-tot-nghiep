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
    QrCode
} from 'lucide-react';

export default function Sidebar() {
    const navStyle = ({ isActive }: { isActive: boolean }) => ({
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        backgroundColor: isActive ? '#1b1b28' : 'transparent',
        color: isActive ? '#3699ff' : '#a2a3b7',
        borderLeft: isActive ? '3px solid #3699ff' : '3px solid transparent',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{ width: '260px', backgroundColor: '#1e1e2d', color: '#a2a3b7', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>

            <div style={{ padding: '20px', fontSize: '22px', fontWeight: 'bold', color: 'white', backgroundColor: '#1a1a27', textAlign: 'center', letterSpacing: '1px' }}>
                Trang Quản trị
            </div>

            <div style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
                <p style={{ padding: '0 20px', fontSize: '12px', textTransform: 'uppercase', color: '#6c7293', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    Menu Quản lý
                </p>

                <NavLink to="/admin/dashboard" style={navStyle}>
                    <LayoutDashboard size={20} /> Tổng quan
                </NavLink>

                <NavLink to="/admin" end style={navStyle}>
                    <UserCheck size={20} /> Duyệt Tình nguyện viên
                </NavLink>

                <NavLink to="/admin/categories" style={navStyle}>
                    <Layers size={20} /> Quản lý Danh mục
                </NavLink>

                <NavLink to="/admin/create" style={navStyle}>
                    <PlusCircle size={20} /> Tạo Chiến dịch mới
                </NavLink>

                <NavLink to="/admin/users" style={navStyle}>
                    <Users size={20} /> Quản lý Tài khoản
                </NavLink>

                <NavLink to="/admin/faculties" style={navStyle}>
                    <GraduationCap size={20} /> Quản lý Khoa
                </NavLink>

                <NavLink to="/admin/campaigns" style={navStyle}>
                    <ClipboardList size={20} /> Quản lý Hoạt động
                </NavLink>
                
                <NavLink to="/admin/posts" style={navStyle}>
                    <Newspaper size={20} /> Quản lý Bài viết
                </NavLink>

                <NavLink to="/admin/student-activities" style={navStyle}>
                    <Activity size={20} /> Theo dõi HĐ Sinh viên
                </NavLink>

                <NavLink to="/admin/assignments" style={navStyle}>
                    <Target size={20} /> Điều phối Nhân sự
                </NavLink>
                <NavLink to="/admin/moments" style={navStyle}>
                    <Image size={20} /> Quản lý Khoảnh khắc
                </NavLink>

                <NavLink to="/admin/history" style={navStyle}>
                    <History size={20} /> Lịch sử Tình nguyện viên
                </NavLink>

                <NavLink to="/admin/banners" style={navStyle}>
                    <ImageIcon size={20} /> Quản lý Banner
                </NavLink>
                <NavLink to="/admin/donations" style={navStyle}>
                    <QrCode size={20} /> Quản lý Quyên góp QR
                </NavLink>

                <NavLink to="/admin/evaluations" style={navStyle}>
                    <Star size={20} /> Đánh giá Tình nguyện viên
                </NavLink>
            </div>
        </div>
    );
}