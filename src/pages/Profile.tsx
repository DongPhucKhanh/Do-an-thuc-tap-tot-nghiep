import { useState, useEffect, useRef } from 'react';
import { Grid, Heart, MessageSquare, Camera, Settings, MapPin, Phone, Mail, User, Calendar, Shield, X, Edit2 } from 'lucide-react';
import api from '../api/axios';

export default function Profile() {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🌟 STATE QUẢN LÝ ĐÓNG/MỞ MODAL CẬP NHẬT THÔNG TIN
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // State lưu trữ dữ liệu tạm thời khi gõ vào Form chỉnh sửa
    const [editForm, setEditForm] = useState({
        fullName: '',
        phone: '',
        studentId: '',
        faculty: '',
        dob: '',
        gender: '',
        address: '',
        lat: '',
        lng: ''
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            const data = response.data.data;
            setProfileData(data);
            
            // Nạp dữ liệu cũ vào form để khi mở modal lên không bị trống trường
            setEditForm({
                fullName: data?.fullName || '',
                phone: data?.phone || '',
                studentId: data?.studentId || '',
                faculty: data?.faculty || '',
                dob: data?.dob || '',
                gender: data?.gender || '',
                address: data?.address || '',
                lat: data?.lat || '',
                lng: data?.lng || ''
            });
        } catch (error) {
            console.error('Lỗi khi tải profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // 🌟 XỬ LÝ 1: Thay đổi riêng Avatar khi click thẳng vào ảnh đại diện
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            
            // Giữ lại các thông tin text cũ tránh bị rỗng DB
            formData.append('fullName', editForm.fullName);
            formData.append('phone', editForm.phone);
            formData.append('studentId', editForm.studentId);
            formData.append('faculty', editForm.faculty);
            formData.append('dob', editForm.dob);
            formData.append('gender', editForm.gender);
            formData.append('address', editForm.address);

            try {
                await api.put('/users/profile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('🎉 Cập nhật ảnh đại diện mới thành công!');
                fetchProfile();
            } catch (error) {
                alert('Lỗi khi tải ảnh đại diện lên server!');
            }
        }
    };

    // 🌟 XỬ LÝ 2: Gửi Form cập nhật thông tin chữ (Họ tên, SĐT, Ngày sinh, Vị trí...)
    const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // BẮT BUỘC: Đóng gói qua FormData vì route backend chứa middleware upload.single
        const formData = new FormData();
        formData.append('fullName', editForm.fullName);
        formData.append('phone', editForm.phone);
        formData.append('studentId', editForm.studentId);
        formData.append('faculty', editForm.faculty);
        formData.append('dob', editForm.dob);
        formData.append('gender', editForm.gender);
        formData.append('address', editForm.address);
        
        if (editForm.lat) formData.append('lat', editForm.lat);
        if (editForm.lng) formData.append('lng', editForm.lng);

        try {
            await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('🎉 Cập nhật thông tin cá nhân thành công!');
            setIsEditModalOpen(false); // Đóng popup modal
            fetchProfile(); // Tải lại trang cá nhân để ăn điểm dữ liệu mới
        } catch (error: any) {
            alert(error.response?.data?.error || 'Lỗi hệ thống khi cập nhật thông tin.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-gray-400 font-medium">
                Đang kết nối luồng dữ liệu trang cá nhân...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-[#fbfbfb] min-h-screen">
            
            {/* ================= PHẦN 1: THÔNG TIN HEADER PROFILE (INSTAGRAM STYLE) ================= */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 border-b pb-12 mb-8">
                
                {/* VÒNG TRÒN AVATAR BẤM ĐỔI FILE */}
                <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-md">
                        <div className="w-full h-full bg-white rounded-full p-1">
                            <img
                                src={profileData?.avatar ? `http://localhost:5000${profileData.avatar}` : 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Avatar'}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                    <div className="absolute inset-1 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Camera size={24} className="animate-pulse" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                </div>

                {/* KHỐI THÔNG TIN CHỮ VÀ CHỈ SỐ THI ĐUA */}
                <div className="space-y-5 flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <h2 className="text-xl sm:text-2xl font-light text-gray-800 tracking-wide">{profileData?.fullName}</h2>
                        <div className="flex gap-2">
                            {/* KÍCH HOẠT: Mở Modal chỉnh sửa khi click nút */}
                            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-1 px-5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-all border">
                                <Edit2 size={12} /> Chỉnh sửa trang cá nhân
                            </button>
                            <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border">
                                <Settings size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Hàng chỉ số đếm số lượng bài viết / lượt thích */}
                    <div className="flex items-center justify-center md:justify-start gap-10 text-sm sm:text-base border-y sm:border-y-0 py-3 sm:py-0">
                        <p className="text-gray-500 font-medium">
                            <span className="text-gray-900 font-extrabold">{profileData?.totalPosts || 0}</span> bài viết
                        </p>
                        <p className="text-gray-500 font-medium">
                            <span className="text-gray-900 font-extrabold">{profileData?.totalLikes || 0}</span> lượt thích
                        </p>
                        <p className="text-gray-500 font-medium">
                            <span className="text-gray-900 font-extrabold">🎖️ {profileData?.faculty || 'Học viên'}</span>
                        </p>
                    </div>

                    {/* Tiểu sử ghi chú thông tin sinh viên liên hệ chuẩn form cũ */}
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 space-y-1.5 max-w-md">
                        <p className="text-gray-900 font-black uppercase tracking-wider text-[10px] bg-blue-50 text-blue-600 inline-block px-2.5 py-0.5 rounded-md border border-blue-100">
                            🛡️ Quyền: {profileData?.role}
                        </p>
                        <p className="flex items-center justify-center md:justify-start gap-1.5"><Mail size={13} className="text-gray-400" /> {profileData?.email}</p>
                        <p className="flex items-center justify-center md:justify-start gap-1.5"><Phone size={13} className="text-gray-400" /> {profileData?.phone || 'Chưa có số điện thoại'}</p>
                        <p className="flex items-center justify-center md:justify-start gap-1.5"><Calendar size={13} className="text-gray-400" /> NS: {profileData?.dob || 'Chưa cập nhật ngày sinh'}</p>
                        <p className="flex items-center justify-center md:justify-start gap-1.5 truncate"><MapPin size={13} className="text-gray-400" /> Nơi ở: {profileData?.address || 'Chưa có địa chỉ lưu trú'}</p>
                    </div>
                </div>
            </div>

            {/* TAB ICON */}
            <div className="flex justify-center border-t border-gray-200 tracking-wider">
                <div className="flex items-center gap-1.5 px-4 py-3 border-t border-black -mt-[1px] text-xs font-bold uppercase text-gray-900 cursor-pointer">
                    <Grid size={14} /> Bài đăng khoảnh khắc
                </div>
            </div>

            {/* LƯỚI ẢNH GRID 3 CỘT INSTAGRAM DISPLAY */}
            <div className="grid grid-cols-3 gap-1 sm:gap-6 mt-4">
                {profileData?.moments?.length === 0 ? (
                    <div className="col-span-3 text-center py-16 text-gray-400 text-xs font-medium">
                        Sếp chưa có bài viết khoảnh khắc tình nguyện nào trên hệ thống.
                    </div>
                ) : (
                    profileData?.moments?.map((moment: any) => {
                        const coverImage = moment.media && moment.media.length > 0 
                            ? `http://localhost:5000${moment.media[0].url}` 
                            : 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Moment';

                        return (
                            <div key={moment.id} className="relative aspect-square overflow-hidden bg-gray-100 group border rounded-xl shadow-2sm">
                                <img
                                    src={coverImage}
                                    alt={moment.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold text-sm sm:text-base cursor-pointer">
                                    <span className="flex items-center gap-1.5">
                                        <Heart size={18} className="fill-current" /> {moment.likes}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={18} className="fill-current" /> {moment.shares}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* =====================================================================================
                ================= 🌟 MỤC SỬA ĐỔI CHÍNH: MODAL POPUP FORM CẬP NHẬT THÔNG TIN REAL =================
                ===================================================================================== */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-fade-in">
                        
                        {/* Header Modal */}
                        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                                📝 Cập nhật thông tin tài khoản
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white font-bold transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        
                        {/* Form Body */}
                        <form onSubmit={handleUpdateProfileSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
                            
                            <div className="grid grid-cols-2 gap-3">
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Họ và Tên sếp:</span>
                                    <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-gray-800" required />
                                </label>
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Số điện thoại:</span>
                                    <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" required />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Ngày sinh:</span>
                                    <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-medium text-gray-600" />
                                </label>
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Giới tính:</span>
                                    <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-gray-700">
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t pt-2">
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Mã số sinh viên (MSSV):</span>
                                    <input type="text" value={editForm.studentId} onChange={e => setEditForm({...editForm, studentId: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" />
                                </label>
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Đơn vị Khoa học:</span>
                                    <input type="text" placeholder="VD: Khoa Công nghệ thông tin" value={editForm.faculty} onChange={e => setEditForm({...editForm, faculty: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" />
                                </label>
                            </div>

                            {/* Trường định vị bản đồ phục vụ cho radar quét khoảng cách gần xa */}
                            <div className="border-t pt-2 space-y-3">
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Địa chỉ cư trú hiện tại (Trọ / Nhà riêng):</span>
                                    <input type="text" placeholder="VD: 95 Tăng Nhơn Phú, Phước Long B, Q9" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 text-gray-600" />
                                </label>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="block space-y-1">
                                        <span className="font-bold text-slate-400 text-[11px]">Vĩ độ địa lý (Latitude - Lat):</span>
                                        <input type="number" step="any" placeholder="VD: 10.8286" value={editForm.lat} onChange={e => setEditForm({...editForm, lat: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg outline-none bg-slate-50 text-xs" />
                                    </label>
                                    <label className="block space-y-1">
                                        <span className="font-bold text-slate-400 text-[11px]">Kinh độ địa lý (Longitude - Lng):</span>
                                        <input type="number" step="any" placeholder="VD: 106.7725" value={editForm.lng} onChange={e => setEditForm({...editForm, lng: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg outline-none bg-slate-50 text-xs" />
                                    </label>
                                </div>
                            </div>

                            {/* Hàng nút hành động dưới đáy modal */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-all">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">
                                    Lưu hồ sơ mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}