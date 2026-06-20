import { useState, useEffect } from 'react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';

export default function AssignTasks() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampId, setSelectedCampId] = useState<number | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. Lấy danh sách chiến dịch khi vừa vào trang
    useEffect(() => {
        api.get('/campaigns')
           .then(res => setCampaigns(res.data.data))
           .catch(console.error);
    }, []);

    // 2. Lấy danh sách Tình nguyện viên đã được duyệt của chiến dịch đó
    const fetchParticipants = async (campaignId: number) => {
        try {
            const response = await api.get(`/campaigns/${campaignId}/registrations`);
            const approvedUsers = response.data.data.filter((reg: any) => reg.status === 'APPROVED');
            setParticipants(approvedUsers);
            setSelectedCampId(campaignId);
            setCurrentPage(1);
        } catch (error: any) { 
            alert("Lỗi tải dữ liệu nhân sự"); 
        }
    };

    // 3. Xử lý Giao việc / Gán Điều phối viên
    const handleAssign = async (regId: number, taskName: string, description: string) => {
        if (!taskName.trim()) return alert("Vui lòng chọn loại nhiệm vụ!");
        try {
            await api.patch(`/campaigns/registrations/${regId}/task`, { assignedTask: taskName, description });
            alert("Đã phân công thành công!");
            if (selectedCampId) fetchParticipants(selectedCampId); // Refresh lại bảng
        } catch (error: any) { 
            alert("Lỗi khi phân công: " + (error.response?.data?.error || error.message)); 
        }
    };

    // 4. Xử lý Thu hồi nhiệm vụ (Điều chỉnh nhân sự)
    const handleRemoveTask = async (taskId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn thu hồi nhiệm vụ này để điều chỉnh nhân sự không?")) return;
        try {
            await api.delete(`/campaigns/tasks/${taskId}`);
            if (selectedCampId) fetchParticipants(selectedCampId);
        } catch (error: any) { 
            alert("Lỗi khi thu hồi nhiệm vụ"); 
        }
    };

    const totalPages = Math.ceil(participants.length / itemsPerPage);
    const paginatedParticipants = participants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e1e2d', margin: 0 }}>
                    🎯 Phân công & Điều phối Nhân sự
                </h2>
                <p style={{ color: '#7e8299', marginTop: '8px', fontSize: '15px' }}>
                    Tối ưu hóa nguồn lực và gán trách nhiệm cho các tình nguyện viên nòng cốt.
                </p>
            </div>

            {/* Stats Cards (Mini Dashboard) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ color: '#b5b5c3', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Tổng chiến dịch</div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#3699ff', marginTop: '10px' }}>{campaigns.length}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ color: '#b5b5c3', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Nhân sự sẵn sàng</div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1bc5bd', marginTop: '10px' }}>
                        {selectedCampId ? participants.length : '--'}
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ color: '#b5b5c3', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Trạng thái</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f64e60', marginTop: '10px' }}>
                        {selectedCampId ? 'Đang điều phối...' : 'Chờ chọn chiến dịch'}
                    </div>
                </div>
            </div>

            {/* Selection Card */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#3f4254' }}>
                    Bắt đầu bằng việc chọn một hoạt động:
                </label>
                <select 
                    onChange={(e) => fetchParticipants(Number(e.target.value))} 
                    defaultValue="" 
                    style={{ 
                        width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #e4e6ef', 
                        fontSize: '16px', backgroundColor: '#f9f9f9', outline: 'none', transition: 'border 0.3s' 
                    }}
                >
                    <option value="" disabled>-- Danh sách các chiến dịch / hoạt động --</option>
                    {campaigns.map(camp => <option key={camp.id} value={camp.id}>{camp.title}</option>)}
                </select>
            </div>

            {/* Main Content Table Card */}
            {selectedCampId && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f6f9', textAlign: 'left' }}>
                                <th style={{ padding: '20px', color: '#464e5f', fontWeight: 'bold', borderBottom: '1px solid #ebedf3' }}>Tình nguyện viên</th>
                                <th style={{ padding: '20px', color: '#464e5f', fontWeight: 'bold', borderBottom: '1px solid #ebedf3', width: '35%' }}>Nhiệm vụ & Vai trò</th>
                                <th style={{ padding: '20px', color: '#464e5f', fontWeight: 'bold', borderBottom: '1px solid #ebedf3', textAlign: 'center' }}>Thao tác điều phối</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '50px', color: '#b5b5c3', fontStyle: 'italic' }}>
                                        Chưa có tình nguyện viên nào được phê duyệt cho hoạt động này.
                                    </td>
                                </tr>
                            ) : (
                                paginatedParticipants.map(reg => (
                                    <tr key={reg.id} style={{ borderBottom: '1px solid #f3f6f9' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#3f4254', fontSize: '15px' }}>{reg.user.fullName}</div>
                                            <div style={{ color: '#b5b5c3', fontSize: '13px' }}>{reg.user.email}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            {reg.tasks && reg.tasks.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {reg.tasks.map((t: any) => (
                                                        <div key={t.id} style={{ 
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            backgroundColor: t.taskName === 'Điều phối viên' ? '#fff4de' : '#f3f6f9',
                                                            padding: '8px 12px', borderRadius: '6px', fontSize: '13px'
                                                        }}>
                                                            <span>
                                                                <strong style={{ color: t.taskName === 'Điều phối viên' ? '#ffa800' : '#3f4254' }}>
                                                                    {t.taskName === 'Điều phối viên' ? '👑 ' : '• '}{t.taskName}
                                                                </strong>
                                                                {t.description && <span style={{ color: '#7e8299' }}> - {t.description}</span>}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleRemoveTask(t.id)}
                                                                title="Thu hồi nhiệm vụ"
                                                                style={{ border: 'none', background: 'none', color: '#f64e60', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#d1d3e0', fontSize: '13px' }}>Chưa được phân công</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '220px', margin: '0 auto' }}>
                                                <select id={`taskType-${reg.id}`} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', fontSize: '13px' }}>
                                                    <option value="Thành viên">👤 Thành viên nhóm</option>
                                                    <option value="Điều phối viên">👑 Điều phối viên</option>
                                                    <option value="Trưởng nhóm">⭐ Trưởng nhóm</option>
                                                    <option value="Hậu cần">📦 Hậu cần / Kỹ thuật</option>
                                                </select>
                                                <input 
                                                    type="text" 
                                                    id={`taskDesc-${reg.id}`} 
                                                    placeholder="Ghi chú cụ thể..." 
                                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', fontSize: '13px' }} 
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const typeSelect = document.getElementById(`taskType-${reg.id}`) as HTMLSelectElement;
                                                        const descInput = document.getElementById(`taskDesc-${reg.id}`) as HTMLInputElement;
                                                        handleAssign(reg.id, typeSelect.value, descInput.value);
                                                        descInput.value = '';
                                                    }}
                                                    style={{ 
                                                        padding: '10px', backgroundColor: '#3699ff', color: 'white', border: 'none', 
                                                        borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' 
                                                    }}
                                                >
                                                    Giao nhiệm vụ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {participants.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={participants.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </div>
    );
}