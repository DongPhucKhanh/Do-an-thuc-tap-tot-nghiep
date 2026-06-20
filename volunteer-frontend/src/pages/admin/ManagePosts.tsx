import { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Image, Calendar, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        return <div className="text-center py-12 text-gray-500 font-bold text-xs">Đang tải danh mục bài viết tin tức...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header điều khiển */}
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800">Quản lý Bài viết Tin tức</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Xuất bản các tin tức tình nguyện và hướng dẫn kỹ năng sống</p>
                </div>
                <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                    <Plus size={14} /> Viết bài mới
                </button>
            </div>

            {/* BẢNG HIỂN THỊ DANH SÁCH BÀI TIN */}
            <div className="bg-white rounded-2xl shadow overflow-hidden border">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                            <th className="p-4">Ảnh bìa</th>
                            <th className="p-4">Tiêu đề tin tức</th>
                            <th className="p-4">Ngày xuất bản</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700 font-medium">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* 🌟 ĐÃ CẬP NHẬT: Đọc trường post.image chuẩn model */}
                                <td className="p-4">
                                    {post.image ? (
                                        <img src={`http://localhost:5000${post.image}`} className="w-20 h-12 object-cover rounded-xl border" alt="news" onError={(e)=>{(e.target as HTMLImageElement).src='https://placehold.co/100x60/e2e8f0/94a3b8?text=No+Image'}} />
                                    ) : (
                                        <div className="w-20 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"><Image size={16} /></div>
                                    )}
                                </td>
                                <td className="p-4 max-w-xs font-bold text-slate-800 line-clamp-2 mt-2">{post.title}</td>
                                <td className="p-4 text-gray-400 text-xs">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex gap-2 justify-center">
                                        <button onClick={() => handleEditClick(post)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all border border-blue-100">
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl transition-all border border-rose-100">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && <div className="text-center py-12 text-gray-400">Chưa có bài viết tin tức nào.</div>}
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border">
                        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-xs sm:text-sm uppercase">{modalMode === 'add' ? '✍️ Viết bài tin tức mới' : '✏️ Chỉnh sửa bài viết'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
                            <label className="block space-y-1">
                                <span className="font-bold text-gray-700">Tiêu đề bài viết:</span>
                                <input type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-semibold" required />
                            </label>
                            <label className="block space-y-1">
                                <span className="font-bold text-gray-700">Nội dung chi tiết:</span>
                                <textarea rows={6} value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 leading-relaxed" required />
                            </label>
                            <div className="block space-y-2 border-t pt-2">
                                <span className="font-bold text-gray-700 block">Ảnh bìa tin tức:</span>
                                {previewUrl && <img src={previewUrl} className="w-full h-40 object-cover rounded-xl border mb-2 shadow-xs" alt="Preview" />}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border font-bold text-gray-500 rounded-xl hover:bg-gray-50">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Lưu bài viết</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}