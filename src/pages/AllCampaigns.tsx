import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import api from '../api/axios';
import CampaignCard from '../components/CampaignCard';

export default function AllCampaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await api.get('/campaigns');
                setCampaigns(res.data.data.filter((c: any) => c.status === 'OPEN'));
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Thanh điều hướng */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none',
                            color: '#64748b',
                            fontWeight: '500',
                            fontSize: '14px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.color = '#0f172a';
                            (e.currentTarget as HTMLElement).style.borderColor = '#94a3b8';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.color = '#64748b';
                            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                        }}
                    >
                        <ArrowLeft size={16} /> Quay lại
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px',
                            backgroundColor: '#eff6ff',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <LayoutGrid size={20} color="#2563eb" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                                Tất cả chiến dịch
                            </h1>
                        </div>
                        <span style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            fontWeight: '700',
                            fontSize: '13px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            border: '1px solid #dbeafe',
                        }}>
                            {campaigns.length}
                        </span>
                    </div>
                </div>

                {/* Danh sách thẻ */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '15px' }}>
                        Đang tải danh sách...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                    }}>
                        {campaigns.length > 0 ? (
                            campaigns.map(camp => (
                                <CampaignCard key={camp.id} campaign={camp} />
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '80px',
                                color: '#94a3b8',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                border: '1px dashed #e2e8f0',
                                fontSize: '15px',
                            }}>
                                Hiện tại không có chiến dịch nào đang mở.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}