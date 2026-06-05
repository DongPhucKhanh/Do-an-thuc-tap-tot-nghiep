import { useState, useEffect } from 'react';
import api from '../api/axios'; // Kiểm tra lại đường dẫn này xem đã khớp với dự án của bạn chưa nhé (có thể là '../config/axios')
import { MapPin, Calendar, CheckCircle, XCircle, Clock, ClipboardList } from 'lucide-react';

export default function MyActivities() {
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        // Gọi API lấy lịch sử của chính sinh viên đang đăng nhập
        const fetchMyActivities = async () => {
            try {
                const res = await api.get('/registrations/me');
                setActivities(res.data.data);
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
            }
        };
        fetchMyActivities();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            backgroundColor: '#eff6ff',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ClipboardList size={22} color="#2563eb" />
                        </div>
                        <h2 style={{
                            margin: 0,
                            color: '#0f172a',
                            fontSize: '26px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                        }}>
                            Việc của tôi
                        </h2>
                    </div>
                    <p style={{ margin: '0 0 0 52px', color: '#64748b', fontSize: '14.5px' }}>
                        Lịch sử đăng ký và tham gia hoạt động tình nguyện
                    </p>
                </div>

                {activities.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '64px 40px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        border: '1px dashed #e2e8f0',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 18px',
                        }}>
                            <ClipboardList size={28} color="#94a3b8" />
                        </div>
                        <h3 style={{ color: '#475569', margin: '0 0 8px 0', fontSize: '17px', fontWeight: '600' }}>
                            Bạn chưa đăng ký chiến dịch nào.
                        </h3>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
                            Hãy ra Trang chủ và chọn một hoạt động ý nghĩa để tham gia nhé!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                    }}>
                        {activities.map(act => (
                            <div
                                key={act.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '18px',
                                    padding: '22px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                    border: '1px solid #f1f5f9',
                                    borderTop: `4px solid ${getStatusColor(act.status)}`,
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                }}
                            >
                                {/* Trạng thái đơn & Ngày nộp */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        padding: '4px 12px',
                                        borderRadius: '999px',
                                        backgroundColor: getStatusBg(act.status),
                                        color: getStatusColor(act.status),
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        letterSpacing: '0.01em',
                                    }}>
                                        {getStatusIcon(act.status)}
                                        {getStatusText(act.status)}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                                        {new Date(act.appliedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                <h3 style={{
                                    margin: '0 0 12px 0',
                                    color: '#0f172a',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    lineHeight: '1.4',
                                    letterSpacing: '-0.01em',
                                }}>
                                    {act.campaign?.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#64748b', fontSize: '13.5px', marginBottom: '8px' }}>
                                    <MapPin size={14} color="#94a3b8" />
                                    {act.campaign?.location || 'Đang cập nhật'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#64748b', fontSize: '13.5px', marginBottom: '16px' }}>
                                    <Calendar size={14} color="#94a3b8" />
                                    Bắt đầu: {act.campaign?.startDate ? new Date(act.campaign.startDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                                </div>

                                {/* Khu vực Nhiệm vụ (Task) được phân công */}
                                {act.tasks && act.tasks.length > 0 && (
                                    <div style={{
                                        backgroundColor: '#f8fafc',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        border: '1px solid #f1f5f9',
                                        marginTop: '4px',
                                    }}>
                                        <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CheckCircle size={14} color="#059669" /> Nhiệm vụ được giao:
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#64748b' }}>
                                            {act.tasks.map((task: any) => (
                                                <li key={task.id} style={{ marginBottom: '4px' }}>{task.taskName}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Các hàm phụ trợ để tự động tô màu trạng thái cho đẹp
const getStatusText = (status: string) => {
    switch(status) {
        case 'APPROVED': return 'Đã được duyệt';
        case 'REJECTED': return 'Từ chối';
        default: return 'Đang chờ duyệt';
    }
};

const getStatusColor = (status: string) => {
    switch(status) {
        case 'APPROVED': return '#059669'; // Xanh lá
        case 'REJECTED': return '#dc2626'; // Đỏ
        default: return '#d97706'; // Vàng cam
    }
};

const getStatusBg = (status: string) => {
    switch(status) {
        case 'APPROVED': return '#ecfdf5'; 
        case 'REJECTED': return '#fef2f2'; 
        default: return '#fffbeb'; 
    }
};

const getStatusIcon = (status: string) => {
    switch(status) {
        case 'APPROVED': return <CheckCircle size={12} />;
        case 'REJECTED': return <XCircle size={12} />;
        default: return <Clock size={12} />;
    }
};