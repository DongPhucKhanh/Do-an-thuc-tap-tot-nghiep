import { useState, useEffect } from 'react';
import { Calendar, MapPin, Loader2, Heart, MessageCircle, Share2, ThumbsUp, Send, Globe, MoreHorizontal, Image as ImageIcon, FolderOpen, X } from 'lucide-react';
import api from '../api/axios';

interface PreviewItem {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

export default function Gallery() {
  const [moments, setMoments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [likedMoments, setLikedMoments] = useState<number[]>([]);
  const [showCommentBoxId, setShowCommentBoxId] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [submittingComment, setSubmittingComment] = useState(false);

  // ====== STATE FORM ĐĂNG BÀI ĐA FILE ======
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Đổi thành mảng chứa nhiều file
  const [previews, setPreviews] = useState<PreviewItem[]>([]); // Mảng chứa nhiều link xem trước
  const [submittingPost, setSubmittingPost] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [momentsRes, campaignsRes] = await Promise.all([
        api.get('/moments'),
        api.get('/campaigns')
      ]);
      setMoments(momentsRes.data.data || momentsRes.data);
      setCampaigns(campaignsRes.data.data || campaignsRes.data);
    } catch (error) {
      console.error('Lỗi nạp bảng tin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý khi người dùng quét chọn nhiều file (Cả ảnh và video) cùng lúc
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);

      const previewsArray: PreviewItem[] = filesArray.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'
      }));
      setPreviews(prev => [...prev, ...previewsArray]);
    }
  };

  // Xóa bớt file trong hàng chờ preview
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || selectedFiles.length === 0) {
      alert('Vui lòng nhập tiêu đề, ngày tháng và chọn ít nhất một ảnh hoặc video nhé!');
      return;
    }

    setSubmittingPost(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('location', location);
    formData.append('date', date);
    if (campaignId) formData.append('campaignId', campaignId);
    if (currentUser.id) formData.append('userId', currentUser.id);

    // 🌟 KỸ THUẬT GỬI MẢNG FILE: Append tuần tự toàn bộ file vào cùng 1 key 'media'
    selectedFiles.forEach(file => {
      formData.append('media', file);
    });

    try {
      await api.post('/moments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('🎉 Đăng tải bài viết đa phương tiện thành công!');
      setTitle(''); setContent(''); setLocation(''); setDate(''); setCampaignId('');
      setSelectedFiles([]); setPreviews([]);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert('Không thể đăng tải bài viết.');
    } finally {
      setSubmittingPost(false);
    }
  };

  const toggleLike = async (id: number) => {
    const isCurrentlyLiked = likedMoments.includes(id);
    const action = isCurrentlyLiked ? 'unlike' : 'like';

    if (isCurrentlyLiked) {
      setLikedMoments(likedMoments.filter(mId => mId !== id));
      setMoments(moments.map(m => m.id === id ? { ...m, likes: m.likes - 1 } : m));
    } else {
      setLikedMoments([...likedMoments, id]);
      setMoments(moments.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
    }

    try {
      await api.patch(`/moments/${id}/like`, { action });
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleShare = async (id: number) => {
    try {
      setMoments(moments.map(m => m.id === id ? { ...m, shares: m.shares + 1 } : m));
      await api.post(`/moments/${id}/share`);
      alert('🎉 Đã chia sẻ bài viết thành công!');
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleCommentSubmit = async (momentId: number, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[momentId]?.trim();
    if (!text) return;
    if (!currentUser.id) return alert('Vui lòng đăng nhập!');

    setSubmittingComment(true);
    try {
      await api.post(`/moments/${momentId}/comments`, { content: text, userId: currentUser.id });
      setCommentInputs({ ...commentInputs, [momentId]: '' });
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4">
      <div className="max-w-[620px] mx-auto space-y-5">
        
        {/* ================= HỘP TẠO BÀI ĐĂNG FACEBOOK CHỌN ĐA FILE ================= */}
        {currentUser.id ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase shrink-0 font-mono">
                {currentUser.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5">🌐 Chia sẻ công khai</p>
              </div>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 pt-1">
              <input type="text" placeholder="Tên hoạt động/Khoảnh khắc ý nghĩa của bạn? *" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold" />
              <textarea rows={2} placeholder="Bạn đang nghĩ gì? Hãy viết dòng cảm nhận, nhật ký chuyến đi vào đây..." value={content} onChange={e => setContent(e.target.value)} className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input type="text" placeholder="📍 Thêm địa điểm..." value={location} onChange={e => setLocation(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-blue-500" />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 focus:outline-none focus:border-blue-500" />
                <select value={campaignId} onChange={e => setCampaignId(e.target.value)} className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 focus:outline-none focus:border-blue-500">
                  <option value="">📂 Thuộc Chiến dịch?</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                {/* Chấp nhận đa định dạng file thông qua multiple và accept video/* */}
                <label className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-bold transition-all">
                  <ImageIcon size={18} className="text-emerald-500" />
                  <span>Chọn Ảnh / Video *</span>
                  <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                </label>

                <button type="submit" disabled={submittingPost} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs sm:text-sm rounded-xl shadow-sm">
                  {submittingPost ? 'Đang tải lên...' : 'Đăng bài'}
                </button>
              </div>

              {/* Lưới hiển thị danh sách file xem trước (Preview) */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border">
                  {previews.map((item, index) => (
                    <div key={index} className="h-20 rounded-lg overflow-hidden border bg-black relative group">
                      {item.type === 'VIDEO' ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover" />
                      )}
                      <button type="button" onClick={() => removeSelectedFile(index)} className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-600">👋 Đăng nhập tài khoản để chia sẻ câu chuyện tình nguyện lên Bảng tin cộng đồng!</p>
          </div>
        )}

        {/* ================= LUỒNG TIMELINE HIỂN THỊ BÀI VIẾT ================= */}
        {loading && moments.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-slate-500 text-xs font-semibold gap-2"><Loader2 size={16} className="animate-spin text-blue-600" /> Đang cập nhật bảng tin...</div>
        ) : moments.length === 0 ? (
          <div className="bg-white text-center py-12 text-slate-400 text-sm rounded-2xl border">Chưa có bài viết nào trên dòng thời gian.</div>
        ) : (
          moments.map((moment) => {
            const isLiked = likedMoments.includes(moment.id);
            const isCommentOpen = showCommentBoxId === moment.id;

            return (
              <div key={moment.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                
                {/* Header bài viết */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase font-mono">
                      {moment.user?.fullName?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900 text-[14px] hover:underline cursor-pointer">{moment.user?.fullName || 'Tình nguyện viên'}</span>
                        {moment.campaign?.title && (
                          <span className="text-xs text-slate-400 font-medium">đã gắn thẻ <b className="text-blue-600 hover:underline">{moment.campaign.title}</b></span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11.5px] mt-0.5 font-medium">
                        <span>{new Date(moment.date).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        {moment.location ? <span className="flex items-center gap-0.5"><MapPin size={11} className="text-orange-500" /> {moment.location}</span> : <Globe size={11} />}
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 p-2 hover:bg-slate-50 rounded-full"><MoreHorizontal size={16} /></button>
                </div>

                {/* Caption / Nội dung text */}
                <div className="px-4 pb-3 space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <h4 className="font-bold text-slate-950 text-[14.5px]">{moment.title}</h4>
                  {moment.content && <p className="text-slate-700 font-normal">{moment.content}</p>}
                </div>

                {/* 🌟 THAY ĐỔI LỚN: KHU VỰC HIỂN THỊ ALBUM LƯỚI ẢNH/VIDEO KIỂU FACEBOOK */}
                {moment.media && moment.media.length > 0 && (
                  <div className={`grid gap-1 bg-slate-100 border-y ${
                    moment.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {moment.media.slice(0, 4).map((file: any, index: number) => {
                      const fileSrc = file.url.startsWith('http') ? file.url : `http://localhost:5000${file.url}`;
                      
                      return (
                        <div key={file.id} className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
                          {file.type === 'VIDEO' ? (
                            <video src={fileSrc} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={fileSrc} alt="Media content" className="w-full h-full object-cover" />
                          )}

                          {/* Nếu có nhiều hơn 4 file, hiển thị nhãn phủ "+X lượt" giống FB */}
                          {index === 3 && moment.media.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                              +{moment.media.length - 4}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Thống kê tương tác */}
                <div className="px-4 py-2 flex items-center justify-between border-b text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]"><ThumbsUp size={9} fill="currentColor" /></div>
                    <span className="font-bold text-slate-600">{moment.likes} lượt thích</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="hover:underline cursor-pointer" onClick={() => setShowCommentBoxId(isCommentOpen ? null : moment.id)}>{moment.comments?.length || 0} bình luận</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">{moment.shares} chia sẻ</span>
                  </div>
                </div>

                {/* Thanh Nút bấm hành động */}
                <div className="px-1.5 py-0.5 flex items-center justify-between border-b text-slate-600 font-bold text-xs sm:text-sm">
                  <button onClick={() => toggleLike(moment.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-all ${isLiked ? 'text-blue-600' : 'hover:text-slate-900'}`}>
                    <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} /> Thích
                  </button>
                  <button onClick={() => setShowCommentBoxId(isCommentOpen ? null : moment.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-all ${isCommentOpen ? 'text-blue-600 bg-slate-50' : 'hover:text-slate-900'}`}>
                    <MessageCircle size={16} /> Bình luận
                  </button>
                  <button onClick={() => handleShare(moment.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                    <Share2 size={16} /> Chia sẻ
                  </button>
                </div>

                {/* Khung bình luận tại chỗ (Inline Comments) */}
                {isCommentOpen && (
                  <div className="bg-slate-50 p-4 space-y-4">
                    {moment.comments && moment.comments.length > 0 && (
                      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                        {moment.comments.map((comment: any) => (
                          <div key={comment.id} className="flex gap-2 items-start">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold uppercase shrink-0 font-mono border">
                              {comment.user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div className="bg-white px-3 py-1.5 rounded-2xl max-w-[85%] border shadow-2sm">
                              <p className="text-[11.5px] font-extrabold text-slate-900">{comment.user?.fullName}</p>
                              <p className="text-xs text-slate-700 mt-0.5 font-normal whitespace-pre-wrap">{comment.content}</p>
                              <span className="text-[9px] text-slate-400 mt-0.5 block">{new Date(comment.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => handleCommentSubmit(moment.id, e)} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold uppercase shrink-0 border font-mono">
                        {currentUser.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 relative flex items-center">
                        <input type="text" placeholder={currentUser.id ? "Viết bình luận công khai..." : "Đăng nhập để viết bình luận..."} disabled={!currentUser.id || submittingComment} value={commentInputs[moment.id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [moment.id]: e.target.value })} className="w-full pl-4 pr-10 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:border-blue-500 transition-all text-slate-800 font-normal" />
                        <button type="submit" disabled={!currentUser.id || submittingComment || !commentInputs[moment.id]?.trim()} className="absolute right-1 p-1 bg-blue-600 disabled:bg-transparent text-white disabled:text-slate-300 rounded-full hover:bg-blue-700 transition-all">
                          <Send size={13} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}