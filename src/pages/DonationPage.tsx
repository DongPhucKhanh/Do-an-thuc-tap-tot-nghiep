import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Heart, ShieldCheck, Smartphone, QrCode, RotateCcw } from 'lucide-react';
import api from '../api/axios';

export default function DonationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState<string>('0');
    const [content, setContent] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

    const [orderId, setOrderId] = useState<string>('');
    const [vietQrUrl, setVietQrUrl] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(600);
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'EXPIRED'>('IDLE');

    // ✅ FIX: Thêm flag này để chặn render cho đến khi check session xong
    const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);

    useEffect(() => {
        const checkPaymentOnLoad = async () => {
            const savedOrderId = sessionStorage.getItem('active_order_id');
            console.log("Đang check status cho orderId từ storage:", savedOrderId);

            if (savedOrderId) {
                try {
                    const res = await api.get(`/payment/status/${savedOrderId}`);
                    console.log("Backend trả về status:", res.data.status);

                    if (res.data.status === 'SUCCESS') {
                        setPaymentStatus('SUCCESS');
                        setOrderId(savedOrderId);
                    } else {
                        const savedAmount = sessionStorage.getItem('active_amount') || '0';
                        const savedQrUrl = sessionStorage.getItem('active_qr_url') || '';
                        setOrderId(savedOrderId);
                        setAmount(savedAmount);
                        setVietQrUrl(savedQrUrl);
                        setPaymentStatus('PENDING');
                    }
                } catch (err) {
                    console.error("Lỗi khi kiểm tra trạng thái sau reload:", err);
                }
            }

            // ✅ Dù có session hay không, check xong mới cho render
            setIsCheckingSession(false);
        };
        checkPaymentOnLoad();
    }, []);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await api.get(`/campaigns/${id}`);
                setCampaign(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    useEffect(() => {
        if (paymentStatus !== 'PENDING' || timeLeft <= 0) {
            if (timeLeft === 0) {
                setPaymentStatus('EXPIRED');
                sessionStorage.clear();
            }
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, paymentStatus]);

    useEffect(() => {
        if (paymentStatus !== 'PENDING' || !orderId) return;

        const checkInterval = setInterval(async () => {
            try {
                const res = await api.get(`/payment/status/${orderId}`);
                if (res.data.status === 'SUCCESS') {
                    setPaymentStatus('SUCCESS');
                    sessionStorage.clear(); // ✅ Dọn session ngay khi polling phát hiện SUCCESS
                    clearInterval(checkInterval);
                }
            } catch (err) {
                console.error(err);
            }
        }, 3000);

        return () => clearInterval(checkInterval);
    }, [orderId, paymentStatus]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSubmitDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseInt(amount.replace(/\./g, ''), 10);

        if (!numericAmount || numericAmount < 10000) {
            alert('Số tiền ủng hộ tối thiểu là 10.000 VNĐ sếp nhé!');
            return;
        }

        try {
            const newOrderId = 'DONATE' + Date.now();
            const textNote = `${isAnonymous ? 'Ẩn danh' : fullName} (${email}): ${content}`;

            // 1. Gửi lên Backend để tạo đơn
            await api.post('/payment/create-fake-pending', {
                orderId: newOrderId,
                amount: numericAmount,
                campaignId: Number(id),
                content: textNote
            });

            // 2. Tạo đường dẫn QR
            const BANK_ID = 'MB';
            const ACCOUNT_NO = '0387093523';
            const ACCOUNT_NAME = 'DONG PHUC KHANH';
            const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${numericAmount}&addInfo=${newOrderId}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

            // 3. 🌟 QUAN TRỌNG: GHI VẾT VÀO BROWSER STORAGE
            // Nếu không có 3 dòng này, F5 là mất sạch!
            sessionStorage.setItem('active_order_id', newOrderId);
            sessionStorage.setItem('active_amount', amount);
            sessionStorage.setItem('active_qr_url', qrUrl);

            console.log("Đã lưu vào Storage, ID là:", newOrderId); // Check log xem có chạy không nhé!

            // 4. Cập nhật State để UI nhảy sang màn hình QR
            setOrderId(newOrderId);
            setVietQrUrl(qrUrl);
            setTimeLeft(600);
            setPaymentStatus('PENDING');

        } catch (err) {
            console.error(err);
            alert('Lỗi hệ thống khởi tạo đơn hàng.');
        }
    };

    const handleClearSession = () => {
        sessionStorage.clear();
        setPaymentStatus('IDLE');
        setVietQrUrl('');
        setAmount('0');
    };

    // ✅ Chặn render hoàn toàn cho đến khi check session xong
    if (isCheckingSession) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-slate-400">Đang kiểm tra phiên thanh toán...</p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <p className="text-sm text-rose-500">Chiến dịch không tồn tại!</p>
        </div>
    );

    const finalTarget = campaign.targetAmount || 0;
    const finalCurrent = campaign.currentAmount || 0;
    const percent = finalTarget > 0 ? Math.min(Math.round((finalCurrent / finalTarget) * 100), 100) : 0;

    /* ─── QUICK AMOUNT PRESETS ─── */
    const presets = [
        { label: '50.000', value: '50000' },
        { label: '100.000', value: '100000' },
        { label: '200.000', value: '200000' },
        { label: '500.000', value: '500000' },
    ];

    /* ─── SHARED STYLE TOKENS ─── */
    const cardStyle: React.CSSProperties = {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#0f172a',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: '#f1f5f9' }}>

            {/* ── TOP NAV ── */}
            <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => { handleClearSession(); navigate(-1); }}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#0f172a'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#64748b'}
                    >
                        <ArrowLeft size={16} />
                        Quay lại chiến dịch
                    </button>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={15} style={{ color: '#16a34a' }} />
                        <span className="text-xs text-slate-400 font-medium">Thanh toán bảo mật</span>
                    </div>
                </div>
            </div>

            {/* ── SUCCESS SCREEN ── */}
            {paymentStatus === 'SUCCESS' ? (
                <div className="max-w-lg mx-auto px-4 py-16">
                    <div style={{ ...cardStyle, padding: '48px 40px', textAlign: 'center' }}>
                        {/* Icon */}
                        <div
                            className="mx-auto mb-6 flex items-center justify-center"
                            style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' }}
                        >
                            <CheckCircle2 size={40} style={{ color: '#16a34a' }} />
                        </div>

                        {/* Heading */}
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Quyên góp thành công!
                        </h2>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px' }}>
                            Cảm ơn bạn đã đóng góp. Số tiền đã được ghi nhận và cộng dồn vào chiến dịch theo thời gian thực.
                        </p>

                        {/* Transaction detail */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Mã giao dịch</span>
                                <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>{orderId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Số tiền</span>
                                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>{Number(amount).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Chiến dịch</span>
                                <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600, maxWidth: '180px', textAlign: 'right' }}>{campaign.title}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { handleClearSession(); navigate(`/campaign/${id}`); }}
                            className="w-full transition-all duration-200"
                            style={{ padding: '13px 0', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                        >
                            Quay lại trang chiến dịch
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                        {/* ── LEFT COLUMN: Campaign Info ── */}
                        <div className="lg:col-span-2 space-y-4">

                            {/* Campaign Image */}
                            <div style={{ ...cardStyle, overflow: 'hidden' }}>
                                <img
                                    src={`http://localhost:5000${campaign.image}`}
                                    className="w-full object-cover"
                                    style={{ height: '220px', display: 'block' }}
                                    alt={campaign.title}
                                />
                                <div style={{ padding: '20px' }}>
                                    {/* Badge */}
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <ShieldCheck size={13} style={{ color: '#16a34a' }} />
                                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Chiến dịch đã xác thực
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '16px' }}>
                                        {campaign.title}
                                    </h2>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Đã góp</p>
                                            <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{(finalCurrent / 1000000).toFixed(1)}M</p>
                                        </div>
                                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Mục tiêu</p>
                                            <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{(finalTarget / 1000000).toFixed(0)}M</p>
                                        </div>
                                        <div style={{ backgroundColor: '#fff7ed', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Hoàn thành</p>
                                            <p style={{ fontSize: '13px', color: '#f97316', fontWeight: 700 }}>{percent}%</p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div
                                                style={{ height: '100%', width: `${percent}%`, backgroundColor: '#f97316', borderRadius: '999px', transition: 'width 0.5s ease' }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{finalCurrent.toLocaleString('vi-VN')} VNĐ</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ {finalTarget.toLocaleString('vi-VN')} VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient badge */}
                            <div style={{ ...cardStyle, padding: '16px' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Heart size={16} style={{ color: '#ef4444' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>Tiền ủng hộ được chuyển đến</p>
                                        <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                                            Quỹ vì trẻ em khuyết tật Việt Nam
                                            <span style={{ color: '#16a34a', marginLeft: '4px', fontSize: '12px' }}>✓</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Form / QR / Expired ── */}
                        <div className="lg:col-span-3">
                            <div style={{ ...cardStyle, padding: '32px' }}>

                                {/* ── IDLE: Donation Form ── */}
                                {paymentStatus === 'IDLE' && (
                                    <form onSubmit={handleSubmitDonation} className="space-y-6">
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                                Thực hiện quyên góp
                                            </h3>
                                            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                                                Điền thông tin bên dưới để tiến hành đóng góp cho chiến dịch.
                                            </p>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                                        {/* Amount input */}
                                        <div className="space-y-2">
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block' }}>
                                                Số tiền ủng hộ (VNĐ) <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="Nhập số tiền..."
                                                    value={amount === '0' ? '' : amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    style={{ ...inputStyle, paddingRight: '52px', fontSize: '20px', fontWeight: 700, color: '#f97316' }}
                                                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#f97316'}
                                                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
                                                />
                                                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>VNĐ</span>
                                            </div>

                                            {/* Preset cards */}
                                            <div className="grid grid-cols-4 gap-2 pt-1">
                                                {presets.map(({ label, value }) => {
                                                    const isActive = amount === value;
                                                    return (
                                                        <button
                                                            key={value}
                                                            type="button"
                                                            onClick={() => setAmount(value)}
                                                            className="transition-all duration-200"
                                                            style={{
                                                                padding: '10px 4px',
                                                                borderRadius: '8px',
                                                                border: isActive ? '2px solid #f97316' : '1px solid #e2e8f0',
                                                                backgroundColor: isActive ? '#fff7ed' : '#f8fafc',
                                                                color: isActive ? '#f97316' : '#475569',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                                                                boxShadow: isActive ? '0 4px 12px rgba(249,115,22,0.15)' : 'none',
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (!isActive) {
                                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fff7ed';
                                                                    (e.currentTarget as HTMLButtonElement).style.color = '#f97316';
                                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (!isActive) {
                                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc';
                                                                    (e.currentTarget as HTMLButtonElement).style.color = '#475569';
                                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                                                }
                                                            }}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block' }}>
                                                Lời chúc / Thông điệp gửi gắm
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập lời chúc trao gửi yêu thương..."
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                style={inputStyle}
                                                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#f97316'}
                                                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
                                            />
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                                        {/* Personal info */}
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Thông tin của bạn</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block' }}>Họ và tên</label>
                                                    <input
                                                        type="text"
                                                        disabled={isAnonymous}
                                                        required={!isAnonymous}
                                                        placeholder="Nhập họ và tên"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        style={{ ...inputStyle, opacity: isAnonymous ? 0.45 : 1 }}
                                                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#f97316'}
                                                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block' }}>Địa chỉ Email</label>
                                                    <input
                                                        type="email"
                                                        disabled={isAnonymous}
                                                        required={!isAnonymous}
                                                        placeholder="Nhập địa chỉ email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        style={{ ...inputStyle, opacity: isAnonymous ? 0.45 : 1 }}
                                                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#f97316'}
                                                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
                                                    />
                                                </div>
                                            </div>

                                            <label
                                                className="flex items-center gap-3 mt-4 cursor-pointer"
                                                style={{ userSelect: 'none' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isAnonymous}
                                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                                    className="w-4 h-4 accent-orange-600"
                                                />
                                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Ủng hộ ẩn danh</span>
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="w-full transition-all duration-200"
                                            style={{ padding: '14px 0', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(249,115,22,0.3)';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                            }}
                                        >
                                            Tiến hành ủng hộ
                                        </button>
                                    </form>
                                )}

                                {/* ── PENDING: QR Screen ── */}
                                {paymentStatus === 'PENDING' && (
                                    <div className="space-y-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                                    Quét mã để thanh toán
                                                </h3>
                                                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Hệ thống sẽ tự động xác nhận sau khi chuyển khoản</p>
                                            </div>
                                            {/* Countdown badge */}
                                            <div
                                                className="flex items-center gap-2 shrink-0"
                                                style={{
                                                    padding: '8px 14px',
                                                    borderRadius: '999px',
                                                    backgroundColor: timeLeft < 60 ? '#fef2f2' : '#fff7ed',
                                                    border: `1px solid ${timeLeft < 60 ? '#fecaca' : '#fed7aa'}`,
                                                }}
                                            >
                                                <Clock size={13} style={{ color: timeLeft < 60 ? '#ef4444' : '#f97316' }} />
                                                <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: timeLeft < 60 ? '#ef4444' : '#f97316' }}>
                                                    {formatTime(timeLeft)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                                        {/* QR code */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    border: '2px solid #16a34a',
                                                    backgroundColor: '#ffffff',
                                                    display: 'inline-block',
                                                    boxShadow: '0 4px 16px rgba(22,163,74,0.12)',
                                                }}
                                            >
                                                <img src={vietQrUrl} style={{ width: '220px', height: '220px', display: 'block', borderRadius: '6px' }} alt="VietQR" />
                                            </div>

                                            {/* Order info */}
                                            <div
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    backgroundColor: '#f8fafc',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Mã đơn hàng</span>
                                                    <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>{orderId}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Số tiền chuyển khoản</span>
                                                    <span style={{ fontSize: '14px', color: '#f97316', fontWeight: 700 }}>{Number(amount).toLocaleString('vi-VN')} VNĐ</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Steps guide */}
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                                                Hướng dẫn thanh toán
                                            </p>
                                            <div className="space-y-3">
                                                {[
                                                    { step: '1', text: 'Mở ứng dụng ngân hàng trên điện thoại', icon: <Smartphone size={14} /> },
                                                    { step: '2', text: 'Chọn chức năng Quét mã QR', icon: <QrCode size={14} /> },
                                                    { step: '3', text: 'Giữ nguyên nội dung chuyển khoản (mã đơn)', icon: <ShieldCheck size={14} /> },
                                                    { step: '4', text: 'Hệ thống tự động xác nhận trong vài giây', icon: <CheckCircle2 size={14} /> },
                                                ].map(({ step, text, icon }) => (
                                                    <div key={step} className="flex items-center gap-3">
                                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                                                            {step}
                                                        </div>
                                                        <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                                                            {icon}
                                                            <span style={{ fontSize: '13px' }}>{text}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                                        {/* Action buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="flex items-center justify-center gap-2 transition-all duration-200"
                                                style={{ flex: 1, padding: '11px 0', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f1f5f9'}
                                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc'}
                                            >
                                                <RotateCcw size={14} /> Tải lại trang
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    // Bỏ luôn cái prompt nhập tay rườm rà đi, lấy thẳng biến orderId của trang
                                                    if (window.confirm(`Bạn có muốn thanh toán cho đơn [ ${orderId} ] không?`)) {
                                                        try {
                                                            await api.post('/payment/force-success', { orderId: orderId });
                                                            alert(" Vui lòng đợi trong giây lát.");
                                                            // Không cần reload luôn, cái Polling 3s nó sẽ tự quét và tự nhảy trang!
                                                        } catch (err) {
                                                            alert("Lỗi ép trạng thái!");
                                                        }
                                                    }
                                                }}
                                                className="flex items-center justify-center gap-2 transition-all duration-200"
                                                style={{ flex: 1, padding: '11px 0', backgroundColor: '#16a34a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#15803d';
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#16a34a';
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                                }}
                                            >
                                                <CheckCircle2 size={14} /> Xác nhận thanh toán
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleClearSession}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#94a3b8', textDecoration: 'underline', display: 'block', margin: '0 auto' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#64748b'}
                                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'}
                                        >
                                            Hủy giao dịch và làm lại
                                        </button>
                                    </div>
                                )}

                                {/* ── EXPIRED ── */}
                                {paymentStatus === 'EXPIRED' && (
                                    <div className="text-center space-y-5 py-8">
                                        <div
                                            className="mx-auto flex items-center justify-center"
                                            style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                                        >
                                            <AlertCircle size={28} style={{ color: '#ef4444' }} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>
                                                Mã QR đã hết hạn
                                            </h3>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                                                Phiên thanh toán đã hết thời gian. Vui lòng tạo lại mã mới để tiếp tục quyên góp.
                                            </p>
                                        </div>
                                        <div
                                            style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'inline-block', maxWidth: '320px' }}
                                        >
                                            <p style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 500 }}>
                                                Giao dịch chưa được ghi nhận. Số tiền (nếu đã chuyển) sẽ được hoàn trả theo quy định.
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleClearSession}
                                                className="transition-all duration-200"
                                                style={{ padding: '12px 32px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(15,23,42,0.2)';
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                                }}
                                            >
                                                Tạo lại mã mới
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}