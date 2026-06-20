import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function ManageRegistrations() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [registrations, setRegistrations] = useState<any[]>([]);

    // Thêm State cho phần Lọc theo Khoa
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e1e2d', marginBottom: '25px' }}>
                <Users size={28} color="#00b894" /> Quản lý Đơn đăng ký (Theo Khoa)
            </h2>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Chọn Chiến dịch:</label>
                    <select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)} style={inputStyle}>
                        <option value="">Chọn một chiến dịch để xem</option>
                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>

                {/* Lọc theo Khoa */}
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Filter size={16} /> Lọc theo Khoa (SV):
                    </label>
                    <select value={selectedFacultyId} onChange={e => setSelectedFacultyId(e.target.value)} style={inputStyle} disabled={!selectedCampaignId}>
                        <option value="">Tất cả các Khoa</option>
                        {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
            </div>

            {/* THỐNG KÊ NHANH & BẢNG DANH SÁCH */}
            {selectedCampaignId && (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0 }}>Danh sách Sinh viên đăng ký</h4>
                        <span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '6px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                            Đang hiển thị: {filteredRegistrations.length} sinh viên
                        </span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f2f6', color: '#636e72', backgroundColor: '#fafafa' }}>
                                <th style={{ padding: '12px 10px' }}>Họ Tên SV</th>
                                <th style={{ padding: '12px 10px' }}>Email</th>
                                <th style={{ padding: '12px 10px' }}>Khoa</th>
                                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Trạng thái</th>
                                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRegistrations.map((reg, index) => (
                                <tr key={reg.id} style={{ borderBottom: '1px solid #f1f2f6', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#2d3436' }}>{reg.user?.fullName}</td>
                                    <td style={{ padding: '12px 10px', color: '#636e72' }}>{reg.user?.email}</td>

                                    {/* CỘT KHOA: Hiển thị tên khoa của SV */}
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{ backgroundColor: '#f3e5f5', color: '#8e44ad', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                                            {reg.user?.faculty?.name || 'Chưa cập nhật'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                            backgroundColor: reg.status === 'APPROVED' ? '#d4edda' : reg.status === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                                            color: reg.status === 'APPROVED' ? '#155724' : reg.status === 'REJECTED' ? '#721c24' : '#856404'
                                        }}>
                                            {reg.status === 'APPROVED' ? 'Đã Duyệt' : reg.status === 'REJECTED' ? 'Từ chối' : 'Chờ Duyệt'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                        {reg.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button onClick={() => handleUpdateStatus(reg.id, 'APPROVED')} title="Duyệt" style={{ border: 'none', background: '#d4edda', color: '#28a745', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(reg.id, 'REJECTED')} title="Từ chối" style={{ border: 'none', background: '#f8d7da', color: '#dc3545', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#b2bec3' }}>
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

const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', outline: 'none', backgroundColor: '#fdfdfd', fontSize: '14px'
};