import { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Camera, X, Edit2, Share2, FileText, Users, Award, Gift, CalendarCheck, MapPin } from 'lucide-react';
import api from '../api/axios';

export default function Profile() {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // STATE TABS
    const [activeTab, setActiveTab] = useState<'activities' | 'achievements' | 'campaigns' | 'donations'>('activities');

    // STATE ĐÓNG/MỞ MODAL CẬP NHẬT THÔNG TIN
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // STATE ĐÓNG/MỞ MODAL XEM CHI TIẾT BÀI VIẾT (MỚI THÊM)
    const [selectedMoment, setSelectedMoment] = useState<any>(null);

    const [editForm, setEditForm] = useState({
        fullName: '', phone: '', studentId: '', faculty: '', 
        dob: '', gender: '', address: '', lat: '', lng: ''
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            const data = response.data.data;
            setProfileData(data);
            
            setEditForm({
                fullName: data?.fullName || '', phone: data?.phone || '', studentId: data?.studentId || '',
                faculty: data?.faculty || '', dob: data?.dob || '', gender: data?.gender || '',
                address: data?.address || '', lat: data?.lat || '', lng: data?.lng || ''
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

    const handleAvatarClick = () => { fileInputRef.current?.click(); };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            
            formData.append('fullName', editForm.fullName); formData.append('phone', editForm.phone);
            formData.append('studentId', editForm.studentId); formData.append('faculty', editForm.faculty);
            formData.append('dob', editForm.dob); formData.append('gender', editForm.gender);
            formData.append('address', editForm.address);

            try {
                await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('🎉 Cập nhật ảnh đại diện mới thành công!');
                fetchProfile();
            } catch (error) {
                alert('Lỗi khi tải ảnh đại diện lên server!');
            }
        }
    };

    const handleCoverClick = () => { coverInputRef.current?.click(); };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('coverPhoto', file);
            
            formData.append('fullName', editForm.fullName); formData.append('phone', editForm.phone);
            formData.append('studentId', editForm.studentId); formData.append('faculty', editForm.faculty);
            formData.append('dob', editForm.dob); formData.append('gender', editForm.gender);
            formData.append('address', editForm.address);

            try {
                await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('🎉 Cập nhật ảnh bìa mới thành công!');
                fetchProfile();
            } catch (error) {
                alert('Lỗi khi tải ảnh bìa lên server!');
            }
        }
    };

    const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', editForm.fullName); formData.append('phone', editForm.phone);
        formData.append('studentId', editForm.studentId); formData.append('faculty', editForm.faculty);
        formData.append('dob', editForm.dob); formData.append('gender', editForm.gender);
        // Bỏ lat/lng khỏi form gửi lên do backend tự auto-geocode
        if (editForm.address) formData.append('address', editForm.address);

        try {
            await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('🎉 Cập nhật thông tin cá nhân thành công!');
            setIsEditModalOpen(false);
            fetchProfile();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Lỗi hệ thống khi cập nhật thông tin.');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'activities':
                return (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Bài đăng khoảnh khắc</h3>
                        <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-4">
                            {profileData?.moments?.length === 0 ? (
                                <div className="col-span-3 text-center py-12 text-gray-400 text-sm font-medium">Bạn chưa có bài viết khoảnh khắc nào.</div>
                            ) : (
                                profileData?.moments?.map((moment: any) => {
                                    const firstMedia = moment.media && moment.media.length > 0 ? moment.media[0] : null;
                                    let mediaUrl = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Moment';
                                    let isVideo = false;

                                    if (firstMedia) {
                                        mediaUrl = firstMedia.url.startsWith('http') ? firstMedia.url : `http://localhost:5000${firstMedia.url}`;
                                        isVideo = firstMedia.type === 'VIDEO' || mediaUrl.toLowerCase().endsWith('.mp4');
                                    }

                                    return (
                                        <div 
                                            key={moment.id} 
                                            onClick={() => setSelectedMoment(moment)}
                                            className="relative aspect-square overflow-hidden bg-gray-100 group rounded-xl cursor-pointer"
                                        >
                                            {isVideo ? (
                                                <video src={mediaUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" muted playsInline />
                                            ) : (
                                                <img src={mediaUrl} alt={moment.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Image'; }} />
                                            )}
                                            
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold text-sm">
                                                <span className="flex items-center gap-1"><Heart size={16} className="fill-current" /> {moment.likes || 0}</span>
                                                <span className="flex items-center gap-1"><MessageSquare size={16} className="fill-current" /> {moment.shares || 0}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            case 'achievements':
                return (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <Award size={40} className="text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Thành tựu của bạn</h3>
                        <p className="text-gray-500 text-sm max-w-md">
                            Tính năng vinh danh và cấp huy hiệu theo số lượng chiến dịch tham gia đang được phát triển. Bạn hãy chờ nhé!
                        </p>
                    </div>
                );
            case 'campaigns':
                return (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Chiến dịch đã tham gia</h3>
                        {(!profileData?.registrations || profileData.registrations.length === 0) ? (
                            <div className="text-center py-12 text-gray-400 text-sm font-medium">Bạn chưa đăng ký tham gia chiến dịch nào.</div>
                        ) : (
                            <div className="space-y-4">
                                {profileData.registrations.map((reg: any) => (
                                    <div key={reg.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                                            <CalendarCheck size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{reg.campaign?.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <MapPin size={12} /> {reg.campaign?.location || 'Không có địa điểm'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${reg.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {reg.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'donations':
                return (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Lịch sử Ủng hộ</h3>
                        
                        <div className="space-y-6">
                            {/* Tiền mặt */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2"><Heart size={16} className="text-red-500" /> Quyên góp tiền mặt</h4>
                                {(!profileData?.donations || profileData.donations.length === 0) ? (
                                    <p className="text-xs text-gray-400 italic">Chưa có giao dịch quyên góp tiền.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {profileData.donations.map((d: any) => (
                                            <div key={d.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{d.campaign?.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{new Date(d.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">+{d.amount.toLocaleString()} đ</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Hiện vật */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2 mt-6"><Gift size={16} className="text-orange-500" /> Quyên góp vật phẩm</h4>
                                {(!profileData?.itemDonations || profileData.itemDonations.length === 0) ? (
                                    <p className="text-xs text-gray-400 italic">Chưa có quyên góp vật phẩm.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {profileData.itemDonations.map((d: any) => (
                                            <div key={d.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{d.campaign?.title}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5 font-medium">{d.type} - {d.quantity}</p>
                                                </div>
                                                <div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                        {d.status === 'RECEIVED' ? 'Đã nhận' : 'Chờ nhận'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-400 font-medium bg-[#f2f4f7]">Đang tải trang cá nhân...</div>;

    return (
        <div className="bg-[#f2f4f7] dark:bg-slate-900 min-h-screen pb-12 transition-colors duration-300">
            
            {/* ================= HEADER BÌA ================= */}
            <div className="relative w-full h-[250px] md:h-[350px]">
                {/* Ảnh bìa */}
                <img 
                    src={profileData?.coverPhoto ? (profileData.coverPhoto.startsWith('http') ? profileData.coverPhoto : `http://localhost:5000${profileData.coverPhoto}`) : 'https://placehold.co/1920x600/f97316/ffffff?text=Anh+bia'} 
                    className="w-full h-full object-cover" 
                    alt="cover" 
                />
                <button onClick={handleCoverClick} className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm transition-all shadow-sm">
                    <Camera size={16} /> <span className="hidden sm:inline">Chỉnh sửa ảnh bìa</span>
                </button>
                <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
            </div>

            {/* ================= THÔNG TIN & TABS ================= */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-white dark:bg-slate-800 rounded-b-2xl shadow-sm -mt-4 pt-16 sm:pt-20 px-4 sm:px-8 pb-0 mb-6 flex flex-col items-center sm:items-start border border-t-0 border-slate-100 dark:border-slate-700 transition-colors">
                    
                    {/* Avatar */}
                    <div 
                        className="absolute -top-16 sm:-top-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white shadow-md cursor-pointer group left-1/2 sm:left-8 -translate-x-1/2 sm:translate-x-0 transition-colors"
                        onClick={handleAvatarClick}
                    >
                        <img 
                            src={profileData?.avatar ? (profileData.avatar.startsWith('http') ? profileData.avatar : `http://localhost:5000${profileData.avatar}`) : 'https://placehold.co/150x150/f97316/ffffff?text=Avatar'} 
                            alt="avatar" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                            <Camera size={24} />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    </div>

                    {/* Info & Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full relative mb-6 pl-0 sm:pl-44">
                        <div className="text-center sm:text-left mt-2 sm:mt-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{profileData?.fullName}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                @{profileData?.studentId || profileData?.email?.split('@')[0]}
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-600 font-medium">
                                <span className="flex items-center gap-1.5"><FileText size={16} className="text-gray-400" /> {profileData?.totalPosts || 0} bài viết</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4 sm:mt-0">
                            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-sm transition-all shadow-sm">
                                <Edit2 size={16} /> Chỉnh sửa thông tin
                            </button>
                            <button className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 sm:gap-10 w-full border-t border-gray-100 justify-center sm:justify-start overflow-x-auto no-scrollbar pt-1">
                        {[
                            { id: 'activities', label: 'Hoạt động' },
                            { id: 'achievements', label: 'Thành tựu' },
                            { id: 'campaigns', label: 'Chiến dịch đồng hành' },
                            { id: 'donations', label: 'Ủng hộ' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 pt-3 px-1 text-sm font-bold whitespace-nowrap transition-all border-b-[3px] ${
                                    activeTab === tab.id 
                                        ? 'border-orange-500 text-orange-500' 
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= MAIN CONTENT 2 CỘT ================= */}
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Cột trái - Tab Content */}
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 min-h-[400px] border border-slate-100 dark:border-slate-700 transition-colors">
                        {renderTabContent()}
                    </div>

                    {/* Cột phải - Thẻ thống kê */}
                    <div className="w-full lg:w-[350px] shrink-0 space-y-4">
                        {/* Thẻ: Cấp độ & Điểm */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors">
                            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
                                <Award className="text-blue-500" size={18} /> Thành tích tình nguyện
                            </h3>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Cấp độ hiện tại</p>
                                    <p className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">Đồng</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Điểm rèn luyện</p>
                                    <p className="font-extrabold text-2xl text-slate-800 dark:text-slate-100">{(profileData?.totalScore || 0) + 85} <span className="text-sm font-medium text-slate-500">pt</span></p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mt-4 mb-2">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Cần thêm 15 điểm để lên cấp Bạc</p>
                        </div>

                        {/* Thẻ: Tóm tắt Đóng góp */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-md text-white p-6 sticky top-6">
                            <h3 className="text-orange-50 font-medium text-sm">Tổng quỹ đã đóng góp</h3>
                            <div className="text-3xl font-bold mt-1 mb-6">
                                {(profileData?.totalDonatedAmount || 0).toLocaleString()} đ
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1 bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                    <Users size={20} className="text-orange-100 mb-2" />
                                    <div className="font-bold text-2xl">{profileData?.registrations?.length || 0}</div>
                                    <div className="text-xs text-orange-100 font-medium mt-1">chiến dịch đã tham gia</div>
                                </div>
                                <div className="flex-1 bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                    <Heart size={20} className="text-orange-100 mb-2" />
                                    <div className="font-bold text-2xl">{profileData?.totalDonationCount || 0}</div>
                                    <div className="text-xs text-orange-100 font-medium mt-1">lượt ủng hộ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* ================= MODAL BUNG TO XEM CHI TIẾT KHOẢNH KHẮC ================= */}
            {selectedMoment && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in"
                    onClick={() => setSelectedMoment(null)}
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                                    {profileData?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <span className="font-bold text-sm text-gray-800 block">{profileData?.fullName}</span>
                                    <span className="text-[10px] text-gray-400 font-medium block">{new Date(selectedMoment.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMoment(null)} className="text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors bg-gray-100 rounded-full p-2">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto">
                            {selectedMoment.media && selectedMoment.media.length > 0 && (
                                <div className="bg-black flex flex-col items-center justify-center w-full gap-1">
                                    {selectedMoment.media.map((file: any, index: number) => {
                                        const mediaUrl = file.url.startsWith('http') ? file.url : `http://localhost:5000${file.url}`;
                                        const isVideo = file.type === 'VIDEO' || mediaUrl.toLowerCase().endsWith('.mp4');
                                        return isVideo ? (
                                            <video key={index} src={mediaUrl} controls autoPlay className="max-h-[60vh] w-full object-contain bg-black" />
                                        ) : (
                                            <img key={index} src={mediaUrl} alt="media" className="max-h-[60vh] w-full object-contain bg-black" />
                                        );
                                    })}
                                </div>
                            )}
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-lg text-gray-900">{selectedMoment.title}</h3>
                                {selectedMoment.content && <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{selectedMoment.content}</p>}
                                <div className="flex items-center gap-5 text-sm text-gray-500 font-bold pt-4 border-t mt-4">
                                    <span className="flex items-center gap-1.5"><Heart size={18} className="text-red-500" /> {selectedMoment.likes || 0} Thích</span>
                                    <span className="flex items-center gap-1.5"><MessageSquare size={18} className="text-blue-500" /> {selectedMoment.comments?.length || 0} Bình luận</span>
                                    <span className="flex items-center gap-1.5"><Share2 size={18} className="text-green-500" /> {selectedMoment.shares || 0} Chia sẻ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL CẬP NHẬT THÔNG TIN ================= */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-fade-in">
                        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">📝 Cập nhật thông tin tài khoản</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white font-bold transition-colors"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdateProfileSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Họ và Tên sếp:</span><input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-gray-800" required /></label>
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Số điện thoại:</span><input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" required /></label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Ngày sinh:</span><input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-medium text-gray-600" /></label>
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Giới tính:</span><select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold text-gray-700"><option value="">-- Chọn giới tính --</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></label>
                            </div>
                            <div className="grid grid-cols-2 gap-3 border-t pt-2">
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Mã số sinh viên (MSSV):</span><input type="text" value={editForm.studentId} onChange={e => setEditForm({...editForm, studentId: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" /></label>
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Đơn vị Khoa học:</span><input type="text" placeholder="VD: Khoa Công nghệ thông tin" value={editForm.faculty} onChange={e => setEditForm({...editForm, faculty: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" /></label>
                            </div>
                            <div className="border-t pt-2 space-y-3">
                                <label className="block space-y-1"><span className="font-bold text-gray-700">Địa chỉ cư trú hiện tại:</span><input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 text-gray-600" /></label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-all">Hủy bỏ</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">Lưu hồ sơ mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}