import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, BookOpen, User } from 'lucide-react';
import api from '../api/axios'; // Đường dẫn axios của sếp

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>(); // Bóc tách ID từ URL trên trình duyệt
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // Bắn API lên backend lấy chi tiết 1 bài viết theo ID
                const response = await api.get(`/posts/${id}`);
                setPost(response.data.data || response.data);
            } catch (error) {
                console.error('Lỗi khi tải chi tiết bài viết:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPostDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-slate-500 font-bold text-xs">
                <div className="animate-pulse flex items-center gap-2">
                    <Clock className="animate-spin" size={16} /> Đang nạp nội dung bài viết...
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white border rounded-2xl text-center shadow-sm space-y-4">
                <BookOpen size={40} className="mx-auto text-slate-300" />
                <h2 className="text-lg font-black text-slate-800">Không tìm thấy bài viết!</h2>
                <p className="text-xs text-slate-400">Bài tin tức này có thể đã bị Admin gỡ bỏ hoặc đường dẫn không chính xác.</p>
                <Link to="/news" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                    <ArrowLeft size={14} /> Quay lại bảng tin
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/40 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Nút quay lại bảng tin */}
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-1 text-xs font-black text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border shadow-2xs"
                >
                    <ArrowLeft size={14} />
                    <span>Quay về Trang chủ</span>
                </Link>

                {/* KHỐI KHUNG NỘI DUNG CHI TIẾT BÀI BÁO */}
                <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-10 space-y-6">
                    
                    {/* Meta thông tin: Ngày đăng, Tác giả */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold text-[11px] tracking-wide uppercase">
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border text-slate-500">
                                <Calendar size={12} />
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={12} />
                                Ban truyền thông Đoàn trường
                            </span>
                        </div>
                        
                        {/* Tiêu đề lớn lớn */}
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                            {post.title}
                        </h1>
                    </div>

                    {/* Hình ảnh lớn tiêu điểm nằm giữa bài viết */}
                    {post.image && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-50 rounded-2xl border">
                            <img 
                                src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/e2e8f0/94a3b8?text=ThienNguyen+News';
                                }}
                            />
                        </div>
                    )}

                    {/* Lõi nội dung văn bản dài (Hỗ trợ xuống dòng mượt mà từ DB) */}
                    <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
                        {post.content || 'Bài viết này chưa được cập nhật nội dung chi tiết văn bản thô.'}
                    </div>

                </article>
            </div>
        </div>
    );
}