import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Trash2, ShieldAlert, Image, Film, Calendar, User } from 'lucide-react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';

export default function ManageMoments() {
    const [moments, setMoments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMoments();
    }, []);

    const fetchMoments = async () => {
        try {
            setLoading(true);
            // Gọi API lấy toàn bộ bài đăng khoảnh khắc mạng xã hội
            const response = await api.get('/moments');
            setMoments(response.data.data || response.data);
        } catch (error) {
            console.error('Lỗi tải danh sách khoảnh khắc:', error);
        } {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("⚠️ Sếp có chắc chắn muốn xóa bài đăng khoảnh khắc này không? Tất cả ảnh/video và bình luận liên quan sẽ bay màu theo đấy!")) return;
        try {
            await api.delete(`/moments/${id}`);
            alert("🎉 Đã xóa bài đăng khoảnh khắc thành công!");
            fetchMoments(); // Tải lại danh sách
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi xóa bài đăng");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-gray-500 font-semibold text-sm">
                Đang quét dữ liệu Album khoảnh khắc tình nguyện...
            </div>
        );
    }

    const totalPages = Math.ceil(moments.length / itemsPerPage);
    const paginatedMoments = moments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 space-y-6">
            {/* Header thanh quản lý */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Quản lý Khoảnh khắc</h2>
                    <p className="text-xs text-gray-400 mt-1">Duyệt bài đăng nhật ký, hình ảnh, clip ngắn của Chiến sĩ tình nguyện</p>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 bg-slate-100 px-4 py-2 rounded-xl border font-bold">
                    Tổng số bài: <span className="text-blue-600">{moments.length}</span> bài viết
                </div>
            </div>

            {/* BẢNG QUẢN TRỊ CHUẨN ĐỒ ÁN */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                        <thead className="bg-gray-50/80">
                            <tr className="text-gray-700 font-semibold uppercase tracking-wider text-[11px]">
                                <th className="px-6 py-4 text-left">Người đăng</th>
                                <th className="px-6 py-4 text-left">Nội dung Nhật ký</th>
                                <th className="px-6 py-4 text-left">Album Đa phương tiện</th>
                                <th className="px-6 py-4 text-center">Tương tác</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
                            {paginatedMoments.map((moment) => (
                                <tr key={moment.id} className="hover:bg-gray-50/50 transition-colors">
                                    
                                    {/* 1. Thông tin người đăng */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 overflow-hidden font-bold">
                                                {moment.user?.avatar ? (
                                                    <img src={`http://localhost:5000${moment.user.avatar}`} className="w-full h-full object-cover" alt="avt" />
                                                ) : (
                                                    <User size={16} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{moment.user?.fullName || 'Ẩn danh'}</p>
                                                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={10} /> {new Date(moment.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 2. Tiêu đề và nội dung text */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="font-bold text-gray-900 leading-snug truncate">{moment.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-normal">{moment.content || 'Không có nội dung chữ'}</p>
                                        {moment.location && (
                                            <span className="inline-block mt-1.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                                📍 {moment.location}
                                            </span>
                                        )}
                                    </td>

                                    {/* 3. 🌟 KHU VỰC SỬA LỖI: Hiển thị danh sách ảnh/video an toàn */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {moment.media && moment.media.length > 0 ? (
                                                moment.media.map((file: any, index: number) => {
                                                    // 🌟 ĐÃ SỬA: Dùng toán tử an toàn (?.) bảo vệ tuyệt đối
                                                    const isVideo = file?.type?.toUpperCase() === 'VIDEO' || file?.url?.endsWith('.mp4');
                                                    
                                                    return (
                                                        <div key={file.id || index} className="relative w-12 h-12 rounded-lg border overflow-hidden bg-gray-50 group">
                                                            {isVideo ? (
                                                                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-cyan-400">
                                                                    <Film size={14} />
                                                                </div>
                                                            ) : (
                                                                <img 
                                                                    src={`http://localhost:5000${file?.url}`} 
                                                                    className="w-full h-full object-cover" 
                                                                    alt="thumb" 
                                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/50x50/e2e8f0/94a3b8?text=Err'; }}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Bài đăng viết thô (Không đính kèm tệp)</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* 4. Thống kê số tim/bình luận công khai */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-xs">
                                        <div className="inline-flex flex-col items-start gap-1">
                                            <span className="flex items-center gap-1 font-bold text-rose-600">
                                                <Heart size={13} className="fill-current" /> {moment.likes} lượt thích
                                            </span>
                                            <span className="flex items-center gap-1 font-bold text-slate-500">
                                                <MessageSquare size={13} /> {moment.shares} bình luận
                                            </span>
                                        </div>
                                    </td>

                                    {/* 5. Thao tác xóa bỏ bài viết phạm quy */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button 
                                            onClick={() => handleDelete(moment.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-2sm"
                                        >
                                            <Trash2 size={12} /> Gỡ bài
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {moments.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={moments.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}

                {moments.length === 0 && (
                    <div className="text-center py-16 text-gray-400 text-xs sm:text-sm font-medium flex flex-col items-center justify-center gap-2">
                        <ShieldAlert size={36} className="text-gray-300" />
                        Chưa có sinh viên nào đăng bài viết khoảnh khắc lên mạng xã hội.
                    </div>
                )}
            </div>
        </div>
    );
}