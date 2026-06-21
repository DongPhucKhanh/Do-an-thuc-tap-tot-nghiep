import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle,
    getBtnApprove, getBtnReject, getSectionCard, getSectionHeader, getFilterPanel, getH2Style,
    getTagStyle,
    palette
} from '../../styles/adminTheme';

export default function ManageRegistrations() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [registrations, setRegistrations] = useState<any[]>([]);

    // Thêm State cho phần Lọc theo Khoa
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Style constants (theme-aware)
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const btnApprove = getBtnApprove(isDark);
    const btnReject = getBtnReject(isDark);
    const tagStyle = getTagStyle(isDark);

    // Lấy danh sách Chiến dịch và danh sách Khoa khi vừa vào trang
    useEffect(() => {
        api.get('/campaigns').then(res => setCampaigns(res.data.data)).catch(console.error);
        api.get('/faculties').then(res => setFaculties(res.data.data)).catch(console.error);
    }, []);

    // Lấy danh sách sinh viên đăng ký khi chọn 1 chiến dịch
    useEffect(() => {
        if (selectedCampaignId) {
            api.get(`/campaigns/${selectedCampaignId}/registrations`)
                .then(res => setRegistrations(res.data.data))
                .catch(console.error);
        } else {
            setRegistrations([]);
        }
    }, [selectedCampaignId]);

    const handleUpdateStatus = async (regId: number, status: string) => {
        try {
            await api.patch(`/registrations/${regId}/status`, { status });
            setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
        } catch (error) { alert("Lỗi cập nhật trạng thái!"); }
    };

    const filteredRegistrations = selectedFacultyId
        ? registrations.filter(r => r.user?.faculty?.id?.toString() === selectedFacultyId)
        : registrations;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCampaignId, selectedFacultyId]);

    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const paginatedRegistrations = filteredRegistrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2 style={getH2Style(isDark)}>
                <Users size={20} color="#2563eb" /> Quản lý Đơn đăng ký (Theo Khoa)
            </h2>

            {/* BỘ LỌC */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', ...getFilterPanel(isDark) }}>
                <div>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px', fontSize: '13px', color: p.textSub }}>Chọn Chiến dịch:</label>
                    <select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)} style={inputStyle}>
                        <option value="">Chọn một chiến dịch để xem</option>
                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px', color: p.textSub, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Filter size={13} /> Lọc theo Khoa (SV):
                    </label>
                    <select value={selectedFacultyId} onChange={e => setSelectedFacultyId(e.target.value)} style={inputStyle} disabled={!selectedCampaignId}>
                        <option value="">Tất cả các Khoa</option>
                        {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            {selectedCampaignId && (
                <div style={getSectionCard(isDark)}>
                    <div style={{ ...getSectionHeader(isDark), justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: p.textSub }}>Danh sách Sinh viên đăng ký</h4>
                        <span style={{ fontSize: '12px', color: p.textMuted }}>Đang hiển thị: <strong>{filteredRegistrations.length}</strong> sinh viên</span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Họ Tên SV</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Khoa</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Trạng thái</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRegistrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td style={tdStyle}><span style={{ fontWeight: 500, color: p.text }}>{reg.user?.fullName}</span></td>
                                    <td style={{ ...tdStyle, color: p.textMuted }}>{reg.user?.email}</td>
                                    <td style={tdStyle}>
                                        <span style={tagStyle}>
                                            {reg.user?.faculty?.name || 'Chưa cập nhật'}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                                            backgroundColor: reg.status === 'APPROVED' ? '#dcfce7' : reg.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                                            color: reg.status === 'APPROVED' ? '#15803d' : reg.status === 'REJECTED' ? '#dc2626' : '#92400e'
                                        }}>
                                            {reg.status === 'APPROVED' ? 'Đã Duyệt' : reg.status === 'REJECTED' ? 'Từ chối' : 'Chờ Duyệt'}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        {reg.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button onClick={() => handleUpdateStatus(reg.id, 'APPROVED')} title="Duyệt" style={btnApprove}>
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(reg.id, 'REJECTED')} title="Từ chối" style={btnReject}>
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: p.textFaint, fontSize: '14px' }}>
                                        Không tìm thấy sinh viên nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {filteredRegistrations.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredRegistrations.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </div>
    );
}