import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowLeft, CheckCircle, Gift, X, Target, Heart, ChevronDown, ChevronUp, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import CampaignCard from '../components/CampaignCard';
import ChatRoom from '../components/ChatRoom';

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

/** Hero Section: full-width image with gradient overlay and campaign metadata */
function CampaignHero({ campaign }: { campaign: any }) {
    const typeBadge =
        campaign.type === 'INDIVIDUAL'
            ? { label: 'Quỹ Cá nhân', bg: 'bg-orange-500/90', text: 'text-white' }
            : { label: 'Chiến dịch Tổ chức', bg: 'bg-blue-600/90', text: 'text-white' };

    return (
        <div className="relative w-full overflow-hidden" style={{ borderRadius: '20px 20px 0 0', height: '420px' }}>
            {/* Image */}
            <img
                src={campaign.image ? `http://localhost:5000${campaign.image}` : 'https://via.placeholder.com/1200x600?text=Campaign'}
                alt={campaign.title}
                className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }} />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${typeBadge.bg} ${typeBadge.text} backdrop-blur-sm`}>
                    {typeBadge.label}
                </span>
                <h1 className="text-white font-bold mb-4 leading-tight" style={{ fontSize: 'clamp(20px, 4vw, 30px)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {campaign.title}
                </h1>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <MapPin size={14} />
                        <span>{campaign.location || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(campaign.startDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <Users size={14} />
                        <span>Cần {campaign.requiredVolunteers} tình nguyện viên</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Progress / Fundraising card */
function CampaignProgress({ finalCurrent, finalTarget, percent, campaignId }: {
    finalCurrent: number; finalTarget: number; percent: number; campaignId: string | undefined;
}) {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(22,163,74,0.18)' }}
            className="bg-white rounded-2xl p-7 border border-green-100"
            style={{ boxShadow: '0 4px 20px rgba(22,163,74,0.1)' }}
        >
            {/* Label */}
            <div className="flex items-center gap-2 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
                <TrendingUp size={14} />
                Tiến độ gây quỹ thời gian thực
            </div>

            {/* Amount */}
            <div className="mb-1">
                <span className="text-3xl font-extrabold text-green-800">
                    {finalCurrent.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm font-semibold text-green-600 ml-1">VNĐ</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
                Mục tiêu: <span className="font-semibold text-slate-600">{finalTarget.toLocaleString('vi-VN')} VNĐ</span>
            </p>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #22c55e, #16a34a)' }}
                />
            </div>

            <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    Đã đạt {percent}%
                </span>
                <span className="text-xs text-slate-400">Còn {100 - percent}% nữa</span>
            </div>

            {/* CTA */}
            <button
                onClick={() => navigate(`/campaign/${campaignId}/donate`)}
                className="w-full flex items-center justify-center gap-2 font-bold text-sm text-white rounded-xl py-3.5 transition-all duration-200"
                style={{ backgroundColor: '#16a34a' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#15803d'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#16a34a'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
                <Heart size={16} fill="white" />
                Quyên góp ủng hộ ngay
            </button>
        </motion.div>
    );
}

/** 4 stat cards row */
function CampaignStats({ campaign }: { campaign: any }) {
    const stats = [
        { icon: <MapPin size={22} className="text-orange-500" />, label: 'Địa điểm', value: campaign.location || 'Chưa cập nhật', bg: 'bg-orange-50' },
        { icon: <Calendar size={22} className="text-blue-500" />, label: 'Bắt đầu', value: new Date(campaign.startDate).toLocaleDateString('vi-VN'), bg: 'bg-blue-50' },
        { icon: <Users size={22} className="text-green-600" />, label: 'Cần tuyển', value: `${campaign.requiredVolunteers} người`, bg: 'bg-green-50' },
        { icon: <Clock size={22} className="text-purple-500" />, label: 'Trạng thái', value: campaign.status === 'OPEN' ? 'Đang mở' : 'Đã đóng', bg: 'bg-purple-50' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 * i }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-2xl p-5 border border-slate-100"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                        {s.icon}
                    </div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{s.value}</p>
                </motion.div>
            ))}
        </div>
    );
}

/** Campaign description with read more / collapse */
function CampaignDescription({ description, showFull, onToggle }: {
    description: string; showFull: boolean; onToggle: () => void;
}) {
    const MAX = 320;
    const truncated = description && description.length > MAX
        ? description.substring(0, MAX) + '...'
        : description;
    const needsTruncate = description && description.length > MAX;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-7 border border-slate-100"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" />
                Chi tiết công việc
            </h3>
            <div className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                {showFull ? description : truncated}
            </div>
            {needsTruncate && (
                <button
                    onClick={onToggle}
                    className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                    {showFull ? (<><ChevronUp size={16} />Thu gọn</>) : (<><ChevronDown size={16} />Xem thêm</>)}
                </button>
            )}
        </motion.div>
    );
}

/** Register + Item donation action buttons */
function CampaignActions({ campaign, isRegistering, onRegister, onOpenModal }: {
    campaign: any; isRegistering: boolean; onRegister: () => void; onOpenModal: () => void;
}) {
    if (campaign.status !== 'OPEN') {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-slate-400 font-semibold text-sm">
                Hoạt động này đã đóng đăng ký
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegister}
                disabled={isRegistering}
                className="flex items-center justify-center gap-2 font-bold text-sm text-white rounded-2xl py-4 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: isRegistering ? '#94a3b8' : '#16a34a', boxShadow: isRegistering ? 'none' : '0 4px 16px rgba(22,163,74,0.25)' }}
            >
                <CheckCircle size={18} />
                {isRegistering ? 'Đang xử lý...' : 'Đăng ký tham gia'}
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenModal}
                className="flex items-center justify-center gap-2 font-bold text-sm text-white rounded-2xl py-4 transition-all duration-200"
                style={{ backgroundColor: '#f97316', boxShadow: '0 4px 16px rgba(249,115,22,0.25)' }}
            >
                <Gift size={18} />
                Quyên góp vật phẩm
            </motion.button>
        </div>
    );
}

/** Item donation modal */
function DonationModal({ show, onClose, onSubmit, form, setForm, isSubmitting }: {
    show: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => void;
    form: any; setForm: (f: any) => void; isSubmitting: boolean;
}) {
    const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 font-sans";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
                    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white w-full flex flex-col overflow-hidden"
                        style={{ borderRadius: '24px', maxWidth: '520px', maxHeight: '90vh', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Gift size={20} className="text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Đăng ký quyên góp vật phẩm</h2>
                                    <p className="text-xs text-slate-400">Điền thông tin bên dưới để đăng ký</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={onSubmit} className="p-7 overflow-y-auto flex-1">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Loại vật phẩm <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                        className={inputCls}
                                    >
                                        <option value="Sách vở / Giáo trình">Sách vở / Giáo trình</option>
                                        <option value="Quần áo / Giày dép">Quần áo / Giày dép</option>
                                        <option value="Nhu yếu phẩm (Mì, gạo, sữa...)">Nhu yếu phẩm (Mì, gạo, sữa...)</option>
                                        <option value="Dụng cụ học tập">Dụng cụ học tập</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Số lượng / Tình trạng <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VD: 5 bộ quần áo cũ còn tốt..."
                                        value={form.quantity}
                                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Dự kiến ngày mang đến <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ghi chú thêm</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Lời nhắn hoặc ghi chú thêm..."
                                        value={form.note}
                                        onChange={e => setForm({ ...form, note: e.target.value })}
                                        className={inputCls}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ backgroundColor: isSubmitting ? '#94a3b8' : '#f97316' }}
                                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký quyên góp'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Related campaigns horizontal scroll carousel */
function RelatedCampaigns({ orgCampaigns }: { orgCampaigns: any[] }) {
    if (!orgCampaigns.length) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12"
        >
            <div className="flex items-center gap-2 mb-6">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" />
                <h2 className="text-xl font-bold text-slate-900">Chiến dịch liên quan</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'thin' }}>
                {orgCampaigns.map(camp => (
                    <div key={camp.id} style={{ minWidth: '300px', maxWidth: '320px', flexShrink: 0 }}>
                        <CampaignCard campaign={camp} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function CampaignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState<any>(null);
    const [otherCampaigns, setOtherCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isApprovedUser, setIsApprovedUser] = useState(false);

    // State quản lý form Quyên góp vật phẩm (Giữ nguyên vẹn)
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
    const [donationForm, setDonationForm] = useState({
        type: 'Sách vở / Giáo trình',
        quantity: '',
        date: '',
        note: ''
    });

    useEffect(() => {
        const fetchDetailAndOthers = async () => {
            setLoading(true);
            try {
                window.scrollTo({ top: 0, behavior: 'smooth' });

                const [detailRes, listRes, myRegRes] = await Promise.all([
                    api.get(`/campaigns/${id}`),
                    api.get('/campaigns'),
                    api.get('/registrations/me').catch(() => ({ data: { data: [] } }))
                ]);

                setCampaign(detailRes.data.data);

                const myRegs = myRegRes.data.data || [];
                const approvedReg = myRegs.find((reg: any) => reg.campaignId === parseInt(id || '0') && reg.status === 'APPROVED');
                if (approvedReg) setIsApprovedUser(true);

                const others = listRes.data.data.filter((c: any) =>
                    c.status === 'OPEN' && c.id !== parseInt(id || '0')
                );
                setOtherCampaigns(others);

            } catch (error) {
                console.error("Lỗi tải chi tiết chiến dịch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailAndOthers();
    }, [id]);

    const handleRegister = async () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn đăng ký tham gia chiến dịch này không?");
        if (!confirm) return;

        setIsRegistering(true);
        try {
            await api.post(`/campaigns/${id}/register`);
            alert("🎉 Đăng ký thành công! Vui lòng chờ duyệt đơn.");
            navigate('/my-activities');
        } catch (error: any) {
            alert(error.response?.data?.error || "Đã có lỗi xảy ra hoặc bạn cần đăng nhập!");
        } finally {
            setIsRegistering(false);
        }
    };

    const handleDonationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingDonation(true);
        try {
            await api.post(`/campaigns/${id}/donate-items`, donationForm);
            alert("🎁 Cảm ơn tấm lòng của bạn! Hệ thống đã ghi nhận thông tin quyên góp.");
            setShowDonationModal(false);
            setDonationForm({ type: 'Sách vở / Giáo trình', quantity: '', date: '', note: '' });
        } catch (error: any) {
            alert(error.response?.data?.error || "Đã có lỗi xảy ra. Bạn đã đăng nhập chưa?");
        } finally {
            setIsSubmittingDonation(false);
        }
    };

    const truncateDescription = (text: string, maxLength: number = 320) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // ── Loading / Error states ──
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-green-500 rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400">Đang tải thông tin chiến dịch...</p>
            </div>
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <p className="text-sm text-red-500">Không tìm thấy chiến dịch!</p>
        </div>
    );

    // 🌟 ĐÃ ĐỒNG BỘ: Lấy dữ liệu dòng tiền tích lũy thật từ DB MySQL của sếp Khoa
    const finalTarget = campaign.targetAmount || 50000000;
    const finalCurrent = campaign.currentAmount || 0;
    const percent = finalTarget > 0 ? Math.min(Math.round((finalCurrent / finalTarget) * 100), 100) : 0;

    const orgCampaigns = otherCampaigns.filter(camp => camp.type === 'ORGANIZATION' || !camp.type);
    const indCampaigns = otherCampaigns.filter(camp => camp.type === 'INDIVIDUAL');

    return (
        <div className="min-h-screen pb-20" style={{ backgroundColor: '#f8fafc' }}>

            {/* ── Top nav ── */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                    >
                        <ArrowLeft size={16} />
                        Quay lại
                    </button>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── Left column (2/3 width) ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Main card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="bg-white overflow-hidden"
                            style={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                        >
                            {/* Hero */}
                            <CampaignHero campaign={campaign} />

                            {/* Body */}
                            <div className="p-7 space-y-6">
                                {/* Stats grid */}
                                <CampaignStats campaign={campaign} />

                                {/* Description */}
                                <CampaignDescription
                                    description={campaign.description || 'Chưa có mô tả chi tiết.'}
                                    showFull={showFullDescription}
                                    onToggle={() => setShowFullDescription(v => !v)}
                                />

                                {/* Action buttons */}
                                <CampaignActions
                                    campaign={campaign}
                                    isRegistering={isRegistering}
                                    onRegister={handleRegister}
                                    onOpenModal={() => setShowDonationModal(true)}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right column (1/3 width) ── */}
                    <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
                        <CampaignProgress
                            finalCurrent={finalCurrent}
                            finalTarget={finalTarget}
                            percent={percent}
                            campaignId={id}
                        />

                        {/* Trust badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            className="bg-white rounded-2xl p-5 border border-slate-100 text-center"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <p className="text-sm font-bold text-slate-800 mb-1">Chiến dịch đã xác thực</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Mọi thông tin và giao dịch được kiểm duyệt bởi hệ thống trường Cao đẳng Công Thương TP.HCM.
                            </p>
                        </motion.div>

                        {/* Chat Room */}
                        {isApprovedUser && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <ChatRoom campaignId={parseInt(id || '0')} />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ── Related campaigns ── */}
                <RelatedCampaigns orgCampaigns={orgCampaigns} />
            </div>

            {/* ── Item donation modal ── */}
            <DonationModal
                show={showDonationModal}
                onClose={() => setShowDonationModal(false)}
                onSubmit={handleDonationSubmit}
                form={donationForm}
                setForm={setDonationForm}
                isSubmitting={isSubmittingDonation}
            />
        </div>
    );
}