import { useState, useEffect } from 'react';
import api from '../../config/axios';

export default function VolunteerHistory() {
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Tải danh sách Tình nguyện viên ngay khi mở trang
    useEffect(() => {
        api.get('/campaigns/volunteers/list') 
           .then(res => setVolunteers(res.data.data))
           .catch(console.error);
    }, []);

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

    return (
        <div>
            <h2 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>Theo dõi Lịch sử Tham gia</h2>
            
            <div style={{ marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>🔍 Chọn Tình nguyện viên:</label>
                <select 
                    onChange={(e) => fetchHistory(Number(e.target.value))} 
                    defaultValue="" 
                    style={{ padding: '10px', minWidth: '350px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="" disabled>-- Tìm kiếm / Chọn tình nguyện viên --</option>
                    {volunteers.map(vol => (
                        <option key={vol.id} value={vol.id}>{vol.fullName} ({vol.email})</option>
                    ))}
                </select>
            </div>

            {selectedUser && (
                <div>
                    <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
                        Hồ sơ hoạt động của: {selectedUser.fullName}
                    </h3>

                    {history.length === 0 ? (
                        <div style={{ padding: '30px', backgroundColor: 'white', textAlign: 'center', color: '#7f8c8d', borderRadius: '8px', marginTop: '10px' }}>
                            Tình nguyện viên này chưa tham gia chiến dịch nào.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px', marginTop: '15px' }}>
                            {history.map((record) => (
                                <div key={record.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
                                    
                                    {/* Tiêu đề chiến dịch & Trạng thái đơn */}
                                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, color: '#2980b9', fontSize: '18px' }}>🏕️ {record.campaign.title}</h4>
                                        <span style={{ 
                                            padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                            backgroundColor: record.status === 'APPROVED' ? '#d4edda' : record.status === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                                            color: record.status === 'APPROVED' ? '#155724' : record.status === 'REJECTED' ? '#721c24' : '#856404'
                                        }}>
                                            {record.status === 'APPROVED' ? 'ĐÃ THAM GIA' : record.status === 'REJECTED' ? 'TỪ CHỐI' : 'CHỜ DUYỆT'}
                                        </span>
                                    </div>

                                    {/* Chi tiết bên trong: Nhiệm vụ & Đánh giá */}
                                    <div style={{ padding: '20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                        {/* Cột Nhiệm vụ */}
                                        <div style={{ flex: '1', minWidth: '250px' }}>
                                            <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>🛠️ Nhiệm vụ đảm nhận:</h5>
                                            {record.tasks.length > 0 ? (
                                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
                                                    {record.tasks.map((t: any) => (
                                                        <li key={t.id} style={{ marginBottom: '5px' }}>
                                                            <strong>{t.taskName}</strong> {t.description && `(${t.description})`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>Không có nhiệm vụ cụ thể</span>}
                                        </div>

                                        {/* Cột Đánh giá */}
                                        <div style={{ flex: '1', minWidth: '250px', borderLeft: '1px dashed #ccc', paddingLeft: '20px' }}>
                                            <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>⭐ Ghi nhận & Đánh giá:</h5>
                                            {record.evaluations.length > 0 ? (
                                                <div>
                                                    {record.evaluations.map((ev: any) => (
                                                        <div key={ev.id} style={{ marginBottom: '10px' }}>
                                                            <div style={{ color: '#f39c12', fontSize: '16px' }}>{'★'.repeat(ev.rating)}{'☆'.repeat(5 - ev.rating)}</div>
                                                            <div style={{ fontStyle: 'italic', color: '#666', fontSize: '14px' }}>"{ev.comment}"</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>Chưa có đánh giá</span>}
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