import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Trash2, ShieldAlert, Film, Calendar, User } from 'lucide-react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getBtnDelete,
    getSectionCard, getH2Style, palette
} from '../../styles/adminTheme';

export default function ManageMoments() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [moments, setMoments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Theme-aware styles inside component
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const btnDelete = getBtnDelete(isDark);

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
            <div style={{ padding: '40px', textAlign: 'center', color: p.textMuted, fontSize: '13px' }}>
                Đang quét dữ liệu Album khoảnh khắc tình nguyện...
            </div>
        );
    }

    const totalPages = Math.ceil(moments.length / itemsPerPage);
    const paginatedMoments = moments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ ...getH2Style(isDark), margin: '0 0 4px 0' }}>Quản lý Khoảnh khắc</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: p.textFaint }}>Duyệt bài đăng nhật ký, hình ảnh, clip ngắn của Chiến sĩ tình nguyện</p>
                </div>
                <span style={{ fontSize: '12px', color: p.textMuted, backgroundColor: isDark ? '#263244' : '#f3f4f6', padding: '6px 12px', borderRadius: '4px', border: `1px solid ${p.border}` }}>
                    Tổng số: <strong>{moments.length}</strong> bài viết
                </span>
            </div>

            {/* BẢNG QUẢN TRỊ */}
            <div style={getSectionCard(isDark)}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Người đăng</th>
                                <th style={thStyle}>Nội dung Nhật ký</th>
                                <th style={thStyle}>Album Đa phương tiện</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Tương tác</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedMoments.map((moment) => (
                                <tr key={moment.id}>

                                    {/* 1. Thông tin người đăng */}
                                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', overflow: 'hidden', flexShrink: 0 }}>
                                                {moment.user?.avatar ? (
                                                    <img src={`http://localhost:5000${moment.user.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avt" />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 500, color: p.text, fontSize: '13px' }}>{moment.user?.fullName || 'Ẩn danh'}</p>
                                                <p style={{ margin: 0, fontSize: '11px', color: p.textFaint, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <Calendar size={10} /> {new Date(moment.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 2. Tiêu đề và nội dung text */}
                                    <td style={{ ...tdStyle, maxWidth: '240px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontWeight: 500, color: p.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{moment.title}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: p.textMuted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{moment.content || 'Không có nội dung chữ'}</p>
                                        {moment.location && (
                                            <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '11px', backgroundColor: isDark ? '#263244' : '#f3f4f6', color: p.textSub, padding: '2px 6px', borderRadius: '4px' }}>
                                                📍 {moment.location}
                                            </span>
                                        )}
                                    </td>

                                    {/* 3. Hiển thị danh sách ảnh/video an toàn */}
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                                            {moment.media && moment.media.length > 0 ? (
                                                moment.media.map((file: any, index: number) => {
                                                    // 🌟 ĐÃ SỬA: Dùng toán tử an toàn (?.) bảo vệ tuyệt đối
                                                    const isVideo = file?.type?.toUpperCase() === 'VIDEO' || file?.url?.endsWith('.mp4');

                                                    return (
                                                        <div key={file.id || index} style={{ width: '44px', height: '44px', borderRadius: '4px', border: `1px solid ${p.border}`, overflow: 'hidden', backgroundColor: p.surfaceAlt }}>
                                                            {isVideo ? (
                                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', color: '#22d3ee' }}>
                                                                    <Film size={14} />
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={`http://localhost:5000${file?.url}`}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    alt="thumb"
                                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/50x50/e2e8f0/94a3b8?text=Err'; }}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span style={{ fontSize: '11px', color: p.textFaint, fontStyle: 'italic' }}>Bài đăng viết thô</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* 4. Thống kê số tim/bình luận */}
                                    <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 500, fontSize: '12px' }}>
                                                <Heart size={12} /> {moment.likes} thích
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.textMuted, fontWeight: 500, fontSize: '12px' }}>
                                                <MessageSquare size={12} /> {moment.shares} bình luận
                                            </span>
                                        </div>
                                    </td>

                                    {/* 5. Thao tác xóa */}
                                    <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        <button
                                            onClick={() => handleDelete(moment.id)}
                                            style={{ ...btnDelete, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', backgroundColor: isDark ? '#3f1f1f' : '#dc2626', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            <Trash2 size={13} /> Gỡ bài
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
                    <div style={{ textAlign: 'center', padding: '48px', color: p.textFaint, fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={32} color={p.border} />
                        Chưa có sinh viên nào đăng bài viết khoảnh khắc lên mạng xã hội.
                    </div>
                )}
            </div>
        </div>
    );
}