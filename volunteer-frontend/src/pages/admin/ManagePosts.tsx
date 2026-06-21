import { useState, useEffect } from 'react';
import { Plus, Image, Calendar, X } from 'lucide-react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';

export default function ManagePosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🌟 STATE QUẢN LÝ PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 5; // Hiển thị 5 bài viết mỗi trang cho UI đẹp

    // 🌟 STATE QUẢN LÝ MODAL (DÙNG CHUNG CHO CẢ THÊM VÀ SỬA)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingPost, setEditingPost] = useState<any>({ title: '', content: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    // fileInputRef reserved for future use

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const fetchPosts = async (page: number) => {
        try {
            setLoading(true);
            const response = await api.get(`/posts?page=${page}&limit=${limit}`);
            setPosts(response.data.data || response.data);
            if (response.data.pagination) {
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mở modal chế độ Thêm bài viết mới
    const handleAddClick = () => {
        setModalMode('add');
        setEditingPost({ title: '', content: '' });
        setSelectedFile(null);
        setPreviewUrl('');
        setIsModalOpen(true);
    };

    // Mở modal chế độ Sửa bài viết cũ
    const handleEditClick = (post: any) => {
        setModalMode('edit');
        setEditingPost({ ...post });
        setSelectedFile(null);
        setPreviewUrl(post.image ? `http://localhost:5000${post.image}` : '');
        setIsModalOpen(true);
    };

    // Xem trước ảnh khi chọn file từ thiết bị
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Xử lý gửi Form (Thêm hoặc Sửa) dùng FormData
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Đóng gói FormData bắt buộc vì có upload hình ảnh qua Multer ở Backend
        const formData = new FormData();
        formData.append('title', editingPost.title);
        formData.append('content', editingPost.content);
        
        // 🌟 ĐÃ CẬP NHẬT: Gửi file trùng tên field 'image' khai báo ở backend route
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            if (modalMode === 'add') {
                await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('🎉 Xuất bản bài viết tin tức mới thành công!');
            } else {
                await api.put(`/posts/${editingPost.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('🎉 Cập nhật bài viết thành công!');
            }
            setIsModalOpen(false);
            fetchPosts(currentPage); // Reset lại danh sách
        } catch (error: any) {
            alert(error.response?.data?.error || 'Có lỗi xảy ra khi lưu bài viết.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Sếp có chắc chắn muốn gỡ bài viết này không? Dữ liệu sẽ mất vĩnh viễn!')) return;
        try {
            await api.delete(`/posts/${id}`);
            alert('Đã gỡ bài viết thành công!');
            fetchPosts(currentPage);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Lỗi khi xóa bài viết');
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', color: '#6b7280', fontSize: '13px' }}>Đang tải danh mục bài viết tin tức...</div>;
    }

    return (
        <div>
            {/* Header điều khiển */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600, color: '#111827' }}>Quản lý Bài viết Tin tức</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Xuất bản các tin tức tình nguyện và hướng dẫn kỹ năng sống</p>
                </div>
                <button onClick={handleAddClick} style={btnPrimary}>
                    <Plus size={14} /> Viết bài mới
                </button>
            </div>

            {/* BẢNG HIỂN THỊ DANH SÁCH BÀI TIN */}
            <div style={{ backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={thStyle}>Ảnh bìa</th>
                            <th style={thStyle}>Tiêu đề tin tức</th>
                            <th style={thStyle}>Ngày xuất bản</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                {/* 🌟 ĐÃ CẬP NHẬT: Đọc trường post.image chuẩn model */}
                                <td style={tdStyle}>
                                    {post.image ? (
                                        <img src={`http://localhost:5000${post.image}`} style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} alt="news" onError={(e)=>{(e.target as HTMLImageElement).src='https://placehold.co/100x60/e2e8f0/94a3b8?text=No+Image'}} />
                                    ) : (
                                        <div style={{ width: '72px', height: '48px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><Image size={14} /></div>
                                    )}
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 500, color: '#111827', maxWidth: '300px' }}>{post.title}</td>
                                <td style={{ ...tdStyle, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button onClick={() => handleEditClick(post)} style={btnEdit}>Sửa</button>
                                        <button onClick={() => handleDelete(post.id)} style={btnDelete}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '13px' }}>Chưa có bài viết tin tức nào.</div>}
            </div>

            {/* THANH PHÂN TRANG */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems || posts.length}
                itemsPerPage={limit}
                onPageChange={setCurrentPage}
            />

            {/* MODAL POPUP FORM (THÊM / SỬA BÀI VIẾT) */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '520px', width: '100%', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <div style={{ backgroundColor: '#1f2937', padding: '14px 16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>{modalMode === 'add' ? 'Viết bài tin tức mới' : 'Chỉnh sửa bài viết'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '75vh', overflowY: 'auto' }}>
                            <label style={{ display: 'block' }}>
                                <span style={labelStyle}>Tiêu đề bài viết:</span>
                                <input type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} style={inputStyle} required />
                            </label>
                            <label style={{ display: 'block' }}>
                                <span style={labelStyle}>Nội dung chi tiết:</span>
                                <textarea rows={6} value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} style={inputStyle} required />
                            </label>
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                                <span style={labelStyle}>Ảnh bìa tin tức:</span>
                                {previewUrl && <img src={previewUrl} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', marginBottom: '8px' }} alt="Preview" />}
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '13px', color: '#6b7280' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Lưu bài viết</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' };
const tdStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '13px', verticalAlign: 'middle' };
const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box' };
const btnPrimary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' };
const btnEdit: React.CSSProperties = { padding: '5px 12px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' };
const btnDelete: React.CSSProperties = { padding: '5px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' };
const btnCancel: React.CSSProperties = { padding: '8px 16px', border: '1px solid #d1d5db', fontWeight: 600, color: '#6b7280', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white', fontSize: '13px' };
const btnSave: React.CSSProperties = { padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' };