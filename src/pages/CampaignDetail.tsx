import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowLeft, CheckCircle, Gift, X } from 'lucide-react';
import api from '../api/axios';
import CampaignCard from '../components/CampaignCard';

export default function CampaignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState<any>(null);
    const [otherCampaigns, setOtherCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // State quản lý form Quyên góp vật phẩm
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

                const [detailRes, listRes] = await Promise.all([
                    api.get(`/campaigns/${id}`),
                    api.get('/campaigns')
                ]);

                setCampaign(detailRes.data.data);

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

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8', fontSize: '15px' }}>
            Đang tải thông tin chiến dịch...
        </div>
    );
    if (!campaign) return (
        <div style={{ textAlign: 'center', padding: '80px', color: '#dc2626', fontSize: '15px' }}>
            Không tìm thấy chiến dịch!
        </div>
    );

    const orgCampaigns = otherCampaigns.filter(camp => camp.type === 'ORGANIZATION' || !camp.type);
    const indCampaigns = otherCampaigns.filter(camp => camp.type === 'INDIVIDUAL');

    const modalInputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '14px',
        fontFamily: 'inherit',
        color: '#0f172a',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box' as const,
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>
                {/* Nút quay lại */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: '#64748b',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontWeight: '500', fontSize: '14px', fontFamily: 'inherit',
                        marginBottom: '28px', padding: '8px 12px',
                        borderRadius: '10px',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                        (e.currentTarget as HTMLElement).style.color = '#0f172a';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#64748b';
                    }}
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(226,232,240,0.8)',
                }}>
                    {/* Ảnh bìa */}
                    <div style={{
                        position: 'relative', height: '400px',
                        backgroundColor: '#f1f5f9', overflow: 'hidden',
                    }}>
                        <img
                            src={campaign.image ? `http://localhost:5000${campaign.image}` : 'https://via.placeholder.com/900x450?text=Ảnh+Chiến+Dịch'}
                            alt={campaign.title}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)',
                        }} />
                    </div>

                    <div style={{ padding: '40px 44px' }}>
                        {/* Loại chiến dịch */}
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 16px',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: '600',
                            marginBottom: '20px',
                            backgroundColor: campaign.type === 'INDIVIDUAL' ? '#fff7ed' : '#eff6ff',
                            color: campaign.type === 'INDIVIDUAL' ? '#c2410c' : '#1d4ed8',
                            border: `1px solid ${campaign.type === 'INDIVIDUAL' ? '#fed7aa' : '#dbeafe'}`,
                        }}>
                            {campaign.type === 'INDIVIDUAL' ? '👤 Quỹ Cá nhân' : '🏢 Chiến dịch Tổ chức'}
                        </span>

                        <h1 style={{
                            fontSize: '30px',
                            fontWeight: '800',
                            color: '#0f172a',
                            lineHeight: '1.25',
                            marginBottom: '32px',
                            letterSpacing: '-0.03em',
                        }}>
                            {campaign.title}
                        </h1>

                        {/* Thông tin cơ bản */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            marginBottom: '40px',
                            backgroundColor: '#f8fafc',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                        }}>
                            <InfoItem
                                icon={<Calendar size={22} color="#059669" />}
                                label="BẮT ĐẦU"
                                value={new Date(campaign.startDate).toLocaleDateString('vi-VN')}
                            />
                            <InfoItem
                                icon={<MapPin size={22} color="#ea580c" />}
                                label="ĐỊA ĐIỂM"
                                value={campaign.location || 'Chưa cập nhật'}
                            />
                            <InfoItem
                                icon={<Users size={22} color="#2563eb" />}
                                label="CẦN TUYỂN"
                                value={`${campaign.requiredVolunteers} người`}
                            />
                        </div>

                        {/* Mô tả */}
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#0f172a',
                            marginBottom: '16px',
                            letterSpacing: '-0.01em',
                        }}>
                            Chi tiết công việc
                        </h3>

                        <div style={{
                            color: '#475569',
                            lineHeight: '1.75',
                            fontSize: '15.5px',
                            marginBottom: '16px',
                            whiteSpace: 'pre-wrap',
                        }}>
                            {showFullDescription
                                ? campaign.description
                                : truncateDescription(campaign.description || 'Chưa có mô tả chi tiết cho chiến dịch này.')
                            }
                        </div>

                        {campaign.description && campaign.description.length > 320 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                style={{
                                    color: '#2563eb',
                                    background: 'none', border: 'none',
                                    fontFamily: 'inherit', fontWeight: '600',
                                    fontSize: '14px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: 0, marginBottom: '8px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1d4ed8'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#2563eb'}
                            >
                                {showFullDescription ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                            </button>
                        )}

                        {/* Nút hành động */}
                        <div style={{
                            marginTop: '40px',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '14px',
                        }}>
                            {campaign.status === 'OPEN' ? (
                                <>
                                    <button
                                        onClick={handleRegister}
                                        disabled={isRegistering}
                                        style={{
                                            flex: 1,
                                            padding: '16px 24px',
                                            borderRadius: '14px',
                                            fontWeight: '700',
                                            fontSize: '15px',
                                            fontFamily: 'inherit',
                                            border: 'none',
                                            cursor: isRegistering ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            color: 'white',
                                            backgroundColor: isRegistering ? '#94a3b8' : '#059669',
                                            boxShadow: isRegistering ? 'none' : '0 6px 20px rgba(5,150,105,0.32)',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => {
                                            if (!isRegistering) {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = '#047857';
                                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(5,150,105,0.40)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isRegistering) {
                                                (e.currentTarget as HTMLElement).style.backgroundColor = '#059669';
                                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(5,150,105,0.32)';
                                            }
                                        }}
                                    >
                                        <CheckCircle size={20} />
                                        {isRegistering ? 'Đang xử lý...' : 'ĐĂNG KÝ THAM GIA'}
                                    </button>

                                    <button
                                        onClick={() => setShowDonationModal(true)}
                                        style={{
                                            flex: 1,
                                            padding: '16px 24px',
                                            borderRadius: '14px',
                                            fontWeight: '700',
                                            fontSize: '15px',
                                            fontFamily: 'inherit',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            color: 'white',
                                            backgroundColor: '#ea580c',
                                            boxShadow: '0 6px 20px rgba(234,88,12,0.30)',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = '#c2410c';
                                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(234,88,12,0.38)';
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = '#ea580c';
                                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(234,88,12,0.30)';
                                        }}
                                    >
                                        <Gift size={20} />
                                        QUYÊN GÓP VẬT PHẨM
                                    </button>
                                </>
                            ) : (
                                <button
                                    disabled
                                    style={{
                                        width: '100%', padding: '16px',
                                        borderRadius: '14px',
                                        fontWeight: '700', fontSize: '15px',
                                        fontFamily: 'inherit', border: 'none',
                                        backgroundColor: '#f1f5f9', color: '#94a3b8',
                                        cursor: 'not-allowed',
                                    }}
                                >
                                    Hoạt động đã đóng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Quyên góp đã được Fix UI */}
            {showDonationModal && (
                <div
                    className="modal-backdrop"
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(15,23,42,0.6)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: '20px',
                        backdropFilter: 'blur(8px)',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setShowDonationModal(false); }}
                >
                    <div
                        className="modal-content"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            width: '100%', maxWidth: '520px',
                            maxHeight: '90vh', // Giới hạn chiều cao modal để không bị lẹm màn hình
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            backgroundColor: '#fff7ed',
                            padding: '22px 28px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderBottom: '1px solid #fed7aa',
                            flexShrink: 0, // Đảm bảo Header không bị co rút
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#c2410c' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    backgroundColor: '#ffedd5',
                                    borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Gift size={22} color="#ea580c" />
                                </div>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.01em' }}>
                                    Đăng ký quyên góp
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowDonationModal(false)}
                                style={{
                                    width: '36px', height: '36px',
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    borderRadius: '10px', color: '#94a3b8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = '#fee2e2';
                                    (e.currentTarget as HTMLElement).style.color = '#dc2626';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                                }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Body (Khu vực form có thể cuộn được) */}
                        <form onSubmit={handleDonationSubmit} style={{ 
                            padding: '28px',
                            overflowY: 'auto', // Thêm thanh cuộn dọc cho form
                            flex: 1 // Tự động dãn ra chiếm phần không gian còn lại
                        }}>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', marginTop: 0, lineHeight: '1.6' }}>
                                Vui lòng điền thông tin vật phẩm bạn muốn gửi tặng cho chiến dịch{' '}
                                <b style={{ color: '#0f172a' }}>{campaign.title}</b>.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div>
                                    <label className="form-label">Loại vật phẩm <span style={{ color: '#dc2626' }}>*</span></label>
                                    <select
                                        required
                                        value={donationForm.type}
                                        onChange={(e) => setDonationForm({...donationForm, type: e.target.value})}
                                        style={modalInputStyle}
                                        onFocus={e => {
                                            e.currentTarget.style.borderColor = '#f97316';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.10)';
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="Sách vở / Giáo trình">Sách vở / Giáo trình</option>
                                        <option value="Quần áo / Giày dép">Quần áo / Giày dép</option>
                                        <option value="Nhu yếu phẩm (Mì, gạo, sữa...)">Nhu yếu phẩm (Mì, gạo, sữa...)</option>
                                        <option value="Dụng cụ học tập">Dụng cụ học tập</option>
                                        <option value="Khác">Loại khác</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">Số lượng / Tình trạng <span style={{ color: '#dc2626' }}>*</span></label>
                                    <input
                                        type="text" required
                                        placeholder="VD: 5 bộ quần áo cũ còn tốt..."
                                        value={donationForm.quantity}
                                        onChange={(e) => setDonationForm({...donationForm, quantity: e.target.value})}
                                        style={modalInputStyle}
                                        onFocus={e => {
                                            e.currentTarget.style.borderColor = '#f97316';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.10)';
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Dự kiến ngày mang đến <span style={{ color: '#dc2626' }}>*</span></label>
                                    <input
                                        type="date" required
                                        value={donationForm.date}
                                        onChange={(e) => setDonationForm({...donationForm, date: e.target.value})}
                                        style={modalInputStyle}
                                        onFocus={e => {
                                            e.currentTarget.style.borderColor = '#f97316';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.10)';
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Ghi chú thêm</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Lời nhắn hoặc yêu cầu hỗ trợ..."
                                        value={donationForm.note}
                                        onChange={(e) => setDonationForm({...donationForm, note: e.target.value})}
                                        style={{ ...modalInputStyle, resize: 'vertical', minHeight: '80px' }}
                                        onFocus={e => {
                                            e.currentTarget.style.borderColor = '#f97316';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.10)';
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingDonation}
                                style={{
                                    width: '100%',
                                    marginTop: '32px', // Nới lỏng khoảng cách một chút
                                    marginBottom: '8px',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    border: 'none',
                                    cursor: isSubmittingDonation ? 'not-allowed' : 'pointer',
                                    color: 'white',
                                    backgroundColor: isSubmittingDonation ? '#94a3b8' : '#ea580c',
                                    boxShadow: isSubmittingDonation ? 'none' : '0 6px 18px rgba(234,88,12,0.30)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    if (!isSubmittingDonation) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#c2410c';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSubmittingDonation) {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#ea580c';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                {isSubmittingDonation ? 'Đang gửi...' : 'GỬI ĐĂNG KÝ QUYÊN GÓP'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Phần Chiến dịch Liên quan */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ borderTop: '1px dashed #e2e8f0', margin: '24px 0 40px' }} />

                {/* Chiến dịch Tổ chức khác */}
                {orgCampaigns.length > 0 && (
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{
                            fontSize: '20px', fontWeight: '700',
                            color: '#0f172a', marginBottom: '24px',
                            letterSpacing: '-0.02em',
                        }}>
                            🏢 Chiến dịch Tổ chức Trường/Khoa khác
                        </h2>
                        <div id="org-related-slider" className="hide-scroll" style={{
                            display: 'flex', gap: '20px',
                            overflowX: 'auto', paddingBottom: '12px', scrollBehavior: 'smooth',
                        }}>
                            {orgCampaigns.map(camp => (
                                <div key={camp.id} style={{ minWidth: '300px', maxWidth: '320px', flexShrink: 0 }}>
                                    <CampaignCard campaign={camp} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quỹ Cá nhân khác */}
                {indCampaigns.length > 0 && (
                    <div>
                        <h2 style={{
                            fontSize: '20px', fontWeight: '700',
                            color: '#0f172a', marginBottom: '24px',
                            letterSpacing: '-0.02em',
                        }}>
                            👤 Chiến dịch Câu Lạc Bộ khác
                        </h2>
                        <div id="ind-related-slider" className="hide-scroll" style={{
                            display: 'flex', gap: '20px',
                            overflowX: 'auto', paddingBottom: '12px', scrollBehavior: 'smooth',
                        }}>
                            {indCampaigns.map(camp => (
                                <div key={camp.id} style={{ minWidth: '300px', maxWidth: '320px', flexShrink: 0 }}>
                                    <CampaignCard campaign={camp} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
                width: '44px', height: '44px', flexShrink: 0,
                backgroundColor: 'white',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
            }}>
                {icon}
            </div>
            <div>
                <p style={{
                    margin: 0, fontSize: '11px', fontWeight: '700',
                    color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginBottom: '5px',
                }}>
                    {label}
                </p>
                <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>
                    {value}
                </p>
            </div>
        </div>
    );
}