import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, User2 } from 'lucide-react';
import api from '../api/axios';
import CampaignCard from '../components/CampaignCard';

export default function CampaignList() {
    // 1. Hook này giúp lấy dữ liệu từ thanh địa chỉ URL
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type'); // Sẽ lấy ra được chữ 'org' hoặc 'ind'

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 2. Gọi API mỗi khi cái "type" trên URL bị thay đổi
    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                // Nếu URL có ?type=org thì nối vào API, nếu không có thì gọi lấy tất cả
                const endpoint = type ? `/campaigns?type=${type}` : '/campaigns';
                
                const res = await api.get(endpoint);
                
                // Chỉ lấy những chiến dịch đang OPEN
                setCampaigns(res.data.data.filter((c: any) => c.status === 'OPEN'));
            } catch (error) {
                console.error("Lỗi tải danh sách:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [type]); // 👈 Quan trọng: Bỏ 'type' vào đây để khi bấm menu khác, trang tự tải lại data

    // Đổi tiêu đề trang cho phù hợp
    const pageTitle = type === 'org' ? 'Chiến dịch từ Trường / Khoa' 
                    : type === 'ind' ? 'Phong trào từ Lớp / Câu lạc bộ' 
                    : 'Tất cả hoạt động';

    const pageIcon = type === 'org'
        ? <Building2 size={22} color="#2563eb" />
        : type === 'ind'
        ? <User2 size={22} color="#059669" />
        : null;

    const iconBg = type === 'org' ? '#eff6ff' : type === 'ind' ? '#ecfdf5' : '#f1f5f9';
    const accentColor = type === 'org' ? '#2563eb' : type === 'ind' ? '#059669' : '#475569';

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {pageIcon && (
                        <div style={{
                            width: '44px', height: '44px',
                            backgroundColor: iconBg,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {pageIcon}
                        </div>
                    )}
                    <div>
                        <h1 style={{
                            fontSize: '24px',
                            color: '#0f172a',
                            margin: 0,
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                        }}>
                            {pageTitle}
                        </h1>
                        <div style={{
                            width: '40px', height: '3px',
                            backgroundColor: accentColor,
                            borderRadius: '2px',
                            marginTop: '8px',
                        }} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '15px' }}>
                        Đang tải dữ liệu...
                    </div>
                ) : campaigns.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                        marginTop: '8px',
                    }}>
                        {campaigns.map((camp) => (
                            <CampaignCard key={camp.id} campaign={camp} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        border: '1px dashed #e2e8f0',
                        color: '#94a3b8',
                        fontSize: '15px',
                        marginTop: '8px',
                    }}>
                        Không có hoạt động nào trong danh mục này.
                    </div>
                )}
            </div>
        </div>
    );
}