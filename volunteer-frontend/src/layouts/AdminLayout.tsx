import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AIAssistant from '../components/AIAssistant';
import { LogOut, User } from 'lucide-react'; // Nạp thêm bộ icon quản trị

export default function AdminLayout() {
    const navigate = useNavigate();

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
        <div className="flex min-h-screen bg-[#f4f5fa] font-sans antialiased selection:bg-blue-500 selection:text-white">
            {/* 1. Thanh Menu Sidebar bên trái */}
            <Sidebar />

            {/* Vùng nội dung trung tâm */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* 🌟 THANH TOP NAVBAR MỚI ĐƯỢC BỔ SUNG */}
                <header className="bg-white h-16 border-b border-slate-200/80 flex items-center justify-between px-6 sm:px-8 shadow-xs shrink-0">
                    {/* Bên trái: Trạng thái hệ thống */}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Hệ thống quản trị thời gian thực</p>
                    </div>
                    
                    {/* Bên phải: Khối Profile & Nút đăng xuất */}
                    <div className="flex items-center gap-4">
                        {/* Avatar và Tên Admin rút từ DB */}
                        <div className="flex items-center gap-2 border-r pr-4 border-slate-200/80">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-xs">
                                {adminInfo.avatar ? (
                                    <img src={`http://localhost:5000${adminInfo.avatar}`} alt="Admin" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-black text-slate-800 leading-none">{adminInfo.fullName || 'Quản trị viên'}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1">Ban tổ chức</p>
                            </div>
                        </div>

                        {/* Nút bấm đăng xuất nhanh dứt điểm lỗi token */}
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black tracking-wide transition-all duration-200 shadow-2sm border border-rose-100 hover:border-rose-600"
                        >
                            <LogOut size={13} />
                            <span className="hidden xs:inline">Đăng xuất</span>
                        </button>
                    </div>
                </header>

                {/* 2. Vùng lõi chứa nội dung các trang quản lý (Outlet) */}
                <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
                    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200/50 min-h-full">
                        <Outlet /> 
                    </div>
                </main>
            </div>

            {/* 3. Khung Bong bóng Trợ lý AI bên phải */}
            <AIAssistant />
        </div>
    );
}