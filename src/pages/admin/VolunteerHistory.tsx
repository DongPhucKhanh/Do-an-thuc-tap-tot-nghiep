import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useTheme } from '../../context/ThemeContext';
import {
    getInputStyle, getSectionCard, getFilterPanel, getH2Style,
    palette
} from '../../styles/adminTheme';

export default function VolunteerHistory() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Tải danh sách Tình nguyện viên và Khoa ngay khi mở trang
    useEffect(() => {
        api.get('/campaigns/volunteers/list') 
           .then(res => setVolunteers(res.data.data))
           .catch(console.error);
        
        api.get('/faculties')
           .then(res => setFaculties(res.data.data))
           .catch(console.error);
    }, []);

    // Lọc danh sách tình nguyện viên theo Khoa
    const filteredVolunteers = selectedFacultyId
        ? volunteers.filter(v => v.facultyId?.toString() === selectedFacultyId)
        : volunteers;

    // Hàm gọi API lấy lịch sử khi Admin chọn 1 người
    const fetchHistory = async (userId: number) => {
        try {
            const user = volunteers.find(v => v.id === userId);
            setSelectedUser(user);
            
            const response = await api.get(`/campaigns/volunteers/${userId}/history`);
            setHistory(response.data.data);
        } catch (error) {
            alert("Lỗi khi tải lịch sử");
        }
    };

    const inputStyle = getInputStyle(isDark);

    return (
        <div>
            <h2 style={getH2Style(isDark)}>Theo dõi Lịch sử Tham gia</h2>
            
            <div style={{ ...getFilterPanel(isDark), marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '13px', color: p.textSub }}>Lọc theo Khoa:</label>
                    <select 
                        value={selectedFacultyId}
                        onChange={(e) => { setSelectedFacultyId(e.target.value); setSelectedUser(null); setHistory([]); }} 
                        style={{ ...inputStyle, width: '100%' }}
                    >
                        <option value="">-- Tất cả các Khoa --</option>
                        {faculties.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: 2, minWidth: '300px' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '13px', color: p.textSub }}>Chọn Tình nguyện viên:</label>
                    <select 
                        onChange={(e) => fetchHistory(Number(e.target.value))} 
                        value={selectedUser ? selectedUser.id : ""}
                        style={{ ...inputStyle, width: '100%' }}
                    >
                        <option value="" disabled>-- Tìm kiếm / Chọn tình nguyện viên --</option>
                        {filteredVolunteers.map(vol => (
                            <option key={vol.id} value={vol.id}>{vol.fullName} ({vol.email})</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedUser && (
                <div>
                    <h3 style={{ color: p.text, borderBottom: '2px solid #2563eb', paddingBottom: '8px', display: 'inline-block', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                        Hồ sơ hoạt động của: {selectedUser.fullName}
                    </h3>

                    {history.length === 0 ? (
                        <div style={{ padding: '32px', backgroundColor: p.surface, textAlign: 'center', color: p.textFaint, borderRadius: '6px', border: `1px solid ${p.border}`, fontSize: '13px' }}>
                            Tình nguyện viên này chưa tham gia chiến dịch nào.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {history.map((record) => (
                                <div key={record.id} style={{ border: `1px solid ${p.border}`, borderRadius: '6px', backgroundColor: p.surface, overflow: 'hidden' }}>
                                    
                                    {/* Tiêu đề chiến dịch & Trạng thái đơn */}
                                    <div style={{ backgroundColor: p.surfaceAlt, padding: '12px 16px', borderBottom: `1px solid ${p.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, color: '#1d4ed8', fontSize: '14px', fontWeight: 600 }}>{record.campaign.title}</h4>
                                        <span style={{ 
                                            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                                            backgroundColor: record.status === 'APPROVED' ? '#dcfce7' : record.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                                            color: record.status === 'APPROVED' ? '#15803d' : record.status === 'REJECTED' ? '#dc2626' : '#92400e'
                                        }}>
                                            {record.status === 'APPROVED' ? 'ĐÃ THAM GIA' : record.status === 'REJECTED' ? 'TỪ CHỐI' : 'CHỜ DUYỆT'}
                                        </span>
                                    </div>

                                    {/* Chi tiết bên trong: Nhiệm vụ & Đánh giá */}
                                    <div style={{ padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                        {/* Cột Nhiệm vụ */}
                                        <div style={{ flex: '1', minWidth: '220px' }}>
                                            <h5 style={{ margin: '0 0 8px 0', color: p.textSub, fontSize: '13px', fontWeight: 600 }}>Nhiệm vụ đảm nhận:</h5>
                                            {record.tasks.length > 0 ? (
                                                <ul style={{ margin: 0, paddingLeft: '16px', color: p.textSub, fontSize: '13px' }}>
                                                    {record.tasks.map((t: any) => (
                                                        <li key={t.id} style={{ marginBottom: '4px' }}>
                                                            <strong>{t.taskName}</strong> {t.description && `(${t.description})`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <span style={{ color: p.textFaint, fontStyle: 'italic', fontSize: '12px' }}>Không có nhiệm vụ cụ thể</span>}
                                        </div>

                                        {/* Cột Đánh giá */}
                                        <div style={{ flex: '1', minWidth: '220px', borderLeft: `1px solid ${p.border}`, paddingLeft: '24px' }}>
                                            <h5 style={{ margin: '0 0 8px 0', color: p.textSub, fontSize: '13px', fontWeight: 600 }}>Ghi nhận & Đánh giá:</h5>
                                            {record.evaluations.length > 0 ? (
                                                <div>
                                                    {record.evaluations.map((ev: any) => (
                                                        <div key={ev.id} style={{ marginBottom: '8px' }}>
                                                            <div style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(ev.rating)}{'☆'.repeat(5 - ev.rating)}</div>
                                                            <div style={{ fontStyle: 'italic', color: p.textMuted, fontSize: '13px' }}>"{ev.comment}"</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <span style={{ color: p.textFaint, fontStyle: 'italic', fontSize: '12px' }}>Chưa có đánh giá</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}