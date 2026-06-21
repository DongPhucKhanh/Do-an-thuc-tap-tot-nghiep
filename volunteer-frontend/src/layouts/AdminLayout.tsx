import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AIAssistant from '../components/AIAssistant';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { palette } from '../styles/adminTheme';

export default function AdminLayout() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    // Tự động đọc dữ liệu Admin đang đăng nhập từ LocalStorage
    const adminInfo = JSON.parse(localStorage.getItem('user') || '{}');

    // 🌟 HÀM XỬ LÝ ĐĂNG XUẤT ĐỒNG BỘ
    const handleLogout = () => {
        if (window.confirm('Sếp Khoa có chắc chắn muốn đăng xuất khỏi hệ thống Quản trị không?')) {
            // Xóa sạch dấu vết phiên đăng nhập cũ để hết sạch lỗi 403 Forbidden
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Đá người dùng về thẳng trang login
            navigate('/login');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: p.bg, fontFamily: "'Segoe UI', sans-serif", transition: 'background-color 0.2s' }}>
            {/* 1. Thanh Menu Sidebar bên trái */}
            <Sidebar />

            {/* Vùng nội dung trung tâm */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                
                {/* THANH TOP NAVBAR */}
                <header style={{
                    backgroundColor: p.surface,
                    height: '56px',
                    borderBottom: `1px solid ${p.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    flexShrink: 0,
                    transition: 'background-color 0.2s, border-color 0.2s'
                }}>
                    {/* Bên trái: Trạng thái hệ thống */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                        <p style={{ margin: 0, fontSize: '12px', color: p.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Hệ thống quản trị</p>
                    </div>
                    
                    {/* Bên phải: Toggle + Profile + Đăng xuất */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                        {/* ── TOGGLE DARK / LIGHT MODE ── */}
                        <button
                            onClick={toggleTheme}
                            title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${p.border}`,
                                backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
                                color: isDark ? '#93c5fd' : '#2563eb',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                            }}
                        >
                            {isDark ? <Sun size={14} /> : <Moon size={14} />}
                            {isDark ? 'Sáng' : 'Tối'}
                        </button>

                        {/* Avatar và Tên Admin */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: `1px solid ${p.border}` }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: isDark ? '#334155' : '#374151', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: 'white', overflow: 'hidden'
                            }}>
                                {adminInfo.avatar ? (
                                    <img src={`http://localhost:5000${adminInfo.avatar}`} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: p.text }}>{adminInfo.fullName || 'Quản trị viên'}</p>
                                <p style={{ margin: 0, fontSize: '11px', color: p.textMuted }}>Ban tổ chức</p>
                            </div>
                        </div>

                        {/* Nút bấm đăng xuất */}
                        <button 
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 14px', backgroundColor: 'transparent',
                                color: '#ef4444', border: '1px solid #fca5a5',
                                borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            <LogOut size={14} />
                            Đăng xuất
                        </button>
                    </div>
                </header>

                {/* 2. Vùng lõi chứa nội dung các trang quản lý (Outlet) */}
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    <div style={{
                        backgroundColor: isDark ? palette.dark.surface : '#ffffff',
                        borderRadius: '8px',
                        border: `1px solid ${p.border}`,
                        minHeight: '100%',
                        padding: '24px',
                        transition: 'background-color 0.2s, border-color 0.2s'
                    }}>
                        <Outlet /> 
                    </div>
                </main>
            </div>

            {/* 3. Khung Bong bóng Trợ lý AI bên phải */}
            <AIAssistant />
        </div>
    );
}