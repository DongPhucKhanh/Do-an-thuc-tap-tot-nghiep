import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Eye, X, Calendar, MapPin } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle,
    getBtnEdit, getSectionCard, getFilterPanel, getH2Style,
    palette
} from '../../styles/adminTheme';

export default function StudentActivities() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [users, setUsers] = useState<any[]>([]);
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        api.get('/users/activities-history').then(res => setUsers(res.data.data || []));
        api.get('/faculties').then(res => setFaculties(res.data.data || []));
    }, []);

    const filteredUsers = selectedFacultyId 
        ? users.filter(u => u.faculty?.id?.toString() === selectedFacultyId)
        : users;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFacultyId]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const btnView = getBtnEdit(isDark);

    return (
        <div>
            {/* Header */}
            <h2 style={{ ...getH2Style(isDark), display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#2563eb" /> 
                Theo dõi hoạt động Sinh viên
            </h2>

            {/* Bộ lọc Khoa */}
            <div style={getFilterPanel(isDark)}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: p.textSub, marginBottom: '6px' }}>
                    Lọc theo Khoa:
                </label>
                <select 
                    value={selectedFacultyId} 
                    onChange={e => setSelectedFacultyId(e.target.value)} 
                    style={{ ...inputStyle, maxWidth: '320px' }}
                >
                    <option value="">-- Tất cả các Khoa --</option>
                    {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            {/* Bảng danh sách */}
            <div style={getSectionCard(isDark)}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: p.surfaceAlt, borderBottom: `1px solid ${p.border}` }}>
                            <th style={thStyle}>Họ và Tên</th>
                            <th style={thStyle}>Khoa</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Số chiến dịch</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: `1px solid ${p.borderLight}` }}>
                                <td style={{ ...tdStyle, fontWeight: 500, color: p.text }}>
                                    {user.fullName || 'Chưa có tên'}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ backgroundColor: isDark ? '#263244' : '#f3f4f6', color: p.textSub, padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                        {user.faculty?.name || 'Không có khoa'}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <span style={{ fontWeight: 600, color: '#059669', fontSize: '16px' }}>
                                        {user.registrations?.length || 0}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        style={btnView}
                                    >
                                        <Eye size={14} />
                                        Xem lịch sử
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: p.textFaint, fontSize: '13px' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {filteredUsers.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modal xem chi tiết */}
            {selectedUser && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: p.surface, width: '100%', maxWidth: '480px', borderRadius: '8px', border: `1px solid ${p.border}`, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {/* Header Modal */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${p.border}` }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: p.text }}>Lịch sử hoạt động</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontWeight: 500 }}>{selectedUser.fullName}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: p.textMuted, borderRadius: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Nội dung Modal */}
                        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                            {selectedUser.registrations?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedUser.registrations.map((reg: any) => (
                                        <div 
                                            key={reg.id} 
                                            style={{ border: `1px solid ${p.border}`, borderRadius: '6px', padding: '12px' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <strong style={{ color: p.text, fontSize: '13px', paddingRight: '8px' }}>
                                                    {reg.campaign?.title}
                                                </strong>
                                                <span style={{
                                                    fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, flexShrink: 0,
                                                    backgroundColor: reg.status === 'APPROVED' ? '#dcfce7' : '#fef3c7',
                                                    color: reg.status === 'APPROVED' ? '#15803d' : '#92400e'
                                                }}>
                                                    {reg.status === 'APPROVED' ? 'Đã tham gia' : 'Chờ duyệt'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: p.textMuted }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={13} />
                                                    {reg.campaign?.location || 'Không có địa điểm'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={13} />
                                                    {reg.campaign?.startDate 
                                                        ? new Date(reg.campaign.startDate).toLocaleDateString('vi-VN') 
                                                        : 'Chưa có ngày'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: p.textFaint, fontSize: '13px' }}>
                                    Sinh viên này chưa tham gia hoạt động nào.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}