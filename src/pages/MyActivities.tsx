import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { MapPin, Calendar, CheckCircle, XCircle, Clock, ClipboardList, Camera, Download, X, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTheme } from '../context/ThemeContext';

export default function MyActivities() {
    const { theme } = useTheme();
    const [activities, setActivities] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    
    // State cho Đăng Khoảnh Khắc
    const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [momentTitle, setMomentTitle] = useState('');
    const [momentContent, setMomentContent] = useState('');
    const [momentLocation, setMomentLocation] = useState('');
    const [momentFiles, setMomentFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ref cho Giấy chứng nhận ẩn
    const certRef = useRef<HTMLDivElement>(null);
    const [certData, setCertData] = useState<{name: string, campaign: string, date: string, rating: number} | null>(null);

    useEffect(() => {
        const fetchMyActivities = async () => {
            try {
                const res = await api.get('/registrations/me');
                setActivities(res.data.data);
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
            }
        };
        fetchMyActivities();
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const openMomentModal = (act: any) => {
        setSelectedCampaign(act.campaign);
        setMomentLocation(act.campaign?.location || '');
        setIsMomentModalOpen(true);
    };

    const handleMomentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', momentTitle);
            formData.append('content', momentContent);
            formData.append('location', momentLocation);
            if (selectedCampaign) formData.append('campaignId', selectedCampaign.id.toString());
            momentFiles.forEach(file => formData.append('media', file));

            await api.post('/moments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('🎉 Khoảnh khắc của bạn đã được gửi và đang chờ duyệt!');
            setIsMomentModalOpen(false);
            setMomentTitle(''); setMomentContent(''); setMomentFiles([]);
        } catch (error) {
            alert('Lỗi khi đăng khoảnh khắc!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadCertificate = async (act: any) => {
        // Tạm thời set data cho cert ẩn
        const rating = act.evaluations && act.evaluations.length > 0 ? act.evaluations[0].rating : 5;
        setCertData({
            name: user?.fullName || 'Tình nguyện viên',
            campaign: act.campaign?.title || 'Chiến dịch tình nguyện',
            date: new Date().toLocaleDateString('vi-VN'),
            rating: rating
        });

        // Đợi React render xong div ẩn
        setTimeout(async () => {
            if (!certRef.current) return;
            try {
                const canvas = await html2canvas(certRef.current, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Chung-Nhan-${act.campaign?.id || 'TN'}.pdf`);
                alert('Tải giấy chứng nhận thành công!');
            } catch (err) {
                console.error('Lỗi tải PDF:', err);
                alert('Có lỗi xảy ra khi tạo chứng nhận.');
            }
        }, 500);
    };

    return (
        <div className="min-h-screen py-10 px-5 transition-colors duration-300 dark:bg-slate-900 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
                            <ClipboardList className="text-blue-600 dark:text-blue-400" size={22} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Việc của tôi</h2>
                    </div>
                    <p className="ml-14 text-sm text-slate-500 dark:text-slate-400">Lịch sử đăng ký và tham gia hoạt động tình nguyện</p>
                </div>

                {activities.length === 0 ? (
                    <div className="text-center py-16 px-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClipboardList size={28} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Bạn chưa đăng ký chiến dịch nào.</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Hãy ra Trang chủ và chọn một hoạt động ý nghĩa để tham gia nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {activities.map(act => (
                            <div key={act.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all relative overflow-hidden">
                                <div style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: getStatusColor(act.status) }} />
                                
                                <div className="flex justify-between items-center mb-4 mt-2">
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: getStatusBg(act.status, theme), color: getStatusColor(act.status) }}>
                                        {getStatusIcon(act.status)} {getStatusText(act.status)}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        {new Date(act.appliedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 leading-snug">
                                    {act.campaign?.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                                    <MapPin size={14} className="text-slate-400" /> {act.campaign?.location || 'Đang cập nhật'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <Calendar size={14} className="text-slate-400" /> {act.campaign?.startDate ? new Date(act.campaign.startDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                                </div>

                                {act.tasks && act.tasks.length > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 mb-4">
                                        <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                                            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-500" /> Nhiệm vụ được giao:
                                        </p>
                                        <ul className="pl-5 text-sm text-slate-600 dark:text-slate-400 list-disc">
                                            {act.tasks.map((task: any) => <li key={task.id}>{task.taskName}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Các nút chức năng khi Đã Duyệt */}
                                {act.status === 'APPROVED' && (
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <button 
                                            onClick={() => openMomentModal(act)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            <Camera size={14} /> Chia sẻ
                                        </button>
                                        <button 
                                            onClick={() => downloadCertificate(act)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                        >
                                            <Download size={14} /> Chứng nhận
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Chia sẻ Khoảnh Khắc */}
            {isMomentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                <Camera size={18} className="text-blue-600 dark:text-blue-400" />
                                Chia sẻ Khoảnh khắc
                            </h3>
                            <button onClick={() => setIsMomentModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleMomentSubmit} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tiêu đề</label>
                                <input required value={momentTitle} onChange={e => setMomentTitle(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white outline-none" placeholder="Cảm nghĩ của bạn..." />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chiến dịch</label>
                                <input readOnly value={selectedCampaign?.title || ''} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-400 text-slate-500 outline-none" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nhật ký chi tiết</label>
                                <textarea required value={momentContent} onChange={e => setMomentContent(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white outline-none resize-none" placeholder="Những kỷ niệm đáng nhớ..."></textarea>
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hình ảnh/Video (Tùy chọn)</label>
                                <label className="flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm text-slate-500 dark:text-slate-400">
                                    <Upload size={16} /> Chọn File ({momentFiles.length} file)
                                    <input type="file" multiple className="hidden" onChange={e => { if(e.target.files) setMomentFiles(Array.from(e.target.files)); }} accept="image/*,video/*" />
                                </label>
                            </div>
                            <button disabled={isSubmitting} type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-70">
                                {isSubmitting ? 'Đang đăng...' : 'Đăng bài viết'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Khung GCN HTML ẩn dùng để tạo PDF */}
            <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
                <div ref={certRef} style={{
                    width: '800px', height: '600px', padding: '40px',
                    backgroundColor: '#ffffff', color: '#000',
                    backgroundImage: 'radial-gradient(#eff6ff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    position: 'relative', fontFamily: 'sans-serif',
                    border: '10px solid #1e3a8a'
                }}>
                    <div style={{ border: '2px solid #3b82f6', height: '100%', padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 style={{ color: '#1e3a8a', fontSize: '36px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>GIẤY CHỨNG NHẬN</h1>
                        <h2 style={{ color: '#2563eb', fontSize: '20px', marginBottom: '40px', fontWeight: 'normal' }}>HOẠT ĐỘNG TÌNH NGUYỆN</h2>
                        
                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '10px' }}>Chứng nhận Tình nguyện viên:</p>
                        <h3 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '20px', fontWeight: 'bold' }}>{certData?.name}</h3>
                        
                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '10px' }}>Đã hoàn thành xuất sắc chiến dịch:</p>
                        <h4 style={{ fontSize: '22px', color: '#1d4ed8', marginBottom: '40px', fontWeight: '600', maxWidth: '600px', lineHeight: 1.4 }}>"{certData?.campaign}"</h4>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 40px', marginTop: 'auto' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>Ngày cấp: {certData?.date}</p>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>Đánh giá: {certData?.rating} Sao</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '40px' }}>Ban Tổ Chức</p>
                                <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>(Đã ký)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Các hàm phụ trợ
const getStatusText = (status: string) => {
    switch(status) {
        case 'APPROVED': return 'Đã được duyệt';
        case 'REJECTED': return 'Từ chối';
        default: return 'Đang chờ duyệt';
    }
};

const getStatusColor = (status: string) => {
    switch(status) {
        case 'APPROVED': return '#059669'; 
        case 'REJECTED': return '#dc2626'; 
        default: return '#d97706'; 
    }
};

const getStatusBg = (status: string, theme: string) => {
    if (theme === 'dark') {
        switch(status) {
            case 'APPROVED': return 'rgba(16, 185, 129, 0.15)';
            case 'REJECTED': return 'rgba(239, 68, 68, 0.15)';
            default: return 'rgba(245, 158, 11, 0.15)';
        }
    }
    switch(status) {
        case 'APPROVED': return '#ecfdf5'; 
        case 'REJECTED': return '#fef2f2'; 
        default: return '#fffbeb'; 
    }
};

const getStatusIcon = (status: string) => {
    switch(status) {
        case 'APPROVED': return <CheckCircle size={14} />;
        case 'REJECTED': return <XCircle size={14} />;
        default: return <Clock size={14} />;
    }
};