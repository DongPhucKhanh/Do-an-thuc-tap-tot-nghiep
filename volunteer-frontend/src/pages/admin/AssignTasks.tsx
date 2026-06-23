import { useState, useEffect } from 'react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';
import KanbanBoard from '../../components/admin/KanbanBoard';
import ChatRoom from '../../components/admin/ChatRoom';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle, getBtnPrimary,
    getStatCard, getStatLabel, getFilterPanel, getSectionCard, palette
} from '../../styles/adminTheme';

export default function AssignTasks() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampId, setSelectedCampId] = useState<number | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    
    // Tab active ('list' | 'kanban' | 'chat')
    const [activeTab, setActiveTab] = useState<'list' | 'kanban' | 'chat'>('list');

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

    const statCard = getStatCard(isDark);
    const statLabel = getStatLabel(isDark);
    const inputStyle = getInputStyle(isDark);
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const btnPrimary = getBtnPrimary(isDark);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600, color: p.text }}>
                    Phân công & Điều phối Nhân sự
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: p.textMuted }}>
                    Tối ưu hóa nguồn lực và gán trách nhiệm cho các tình nguyện viên nòng cốt.
                </p>
            </div>

            {/* Thống kê nhanh */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={statCard}>
                    <div style={statLabel}>Tổng chiến dịch</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb', marginTop: '6px' }}>{campaigns.length}</div>
                </div>
                <div style={statCard}>
                    <div style={statLabel}>Nhân sự sẵn sàng</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669', marginTop: '6px' }}>
                        {selectedCampId ? participants.length : '--'}
                    </div>
                </div>
                <div style={statCard}>
                    <div style={statLabel}>Trạng thái</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: selectedCampId ? '#92400e' : p.textMuted, marginTop: '6px' }}>
                        {selectedCampId ? 'Đang điều phối...' : 'Chờ chọn chiến dịch'}
                    </div>
                </div>
            </div>

            {/* Tab điều hướng */}
            {selectedCampId && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button 
                        onClick={() => setActiveTab('list')}
                        style={{ ...btnPrimary, backgroundColor: activeTab === 'list' ? '#2563eb' : p.surfaceAlt, color: activeTab === 'list' ? 'white' : p.textSub, border: `1px solid ${p.border}` }}
                    >
                        Danh sách Phân công
                    </button>
                    <button 
                        onClick={() => setActiveTab('kanban')}
                        style={{ ...btnPrimary, backgroundColor: activeTab === 'kanban' ? '#2563eb' : p.surfaceAlt, color: activeTab === 'kanban' ? 'white' : p.textSub, border: `1px solid ${p.border}` }}
                    >
                        Bảng Kanban Tiến độ
                    </button>
                    <button 
                        onClick={() => setActiveTab('chat')}
                        style={{ ...btnPrimary, backgroundColor: activeTab === 'chat' ? '#2563eb' : p.surfaceAlt, color: activeTab === 'chat' ? 'white' : p.textSub, border: `1px solid ${p.border}` }}
                    >
                        Kênh Thảo luận (Chat)
                    </button>
                </div>
            )}

            {/* Chọn chiến dịch */}
            <div style={{ ...getFilterPanel(isDark), marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: p.textSub, fontSize: '13px' }}>
                    Bắt đầu bằng việc chọn một hoạt động:
                </label>
                <select 
                    onChange={(e) => fetchParticipants(Number(e.target.value))} 
                    defaultValue="" 
                    style={inputStyle}
                >
                    <option value="" disabled>-- Danh sách các chiến dịch / hoạt động --</option>
                    {campaigns.map(camp => <option key={camp.id} value={camp.id}>{camp.title}</option>)}
                </select>
            </div>

            {/* Giao diện tương ứng với Tab */}
            {selectedCampId && activeTab === 'list' && (
                <div style={getSectionCard(isDark)}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: p.surfaceAlt, borderBottom: `1px solid ${p.border}`, textAlign: 'left' }}>
                                <th style={thStyle}>Tình nguyện viên</th>
                                <th style={{ ...thStyle, width: '35%' }}>Nhiệm vụ & Vai trò</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác điều phối</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: p.textFaint, fontSize: '13px' }}>
                                        Chưa có tình nguyện viên nào được phê duyệt cho hoạt động này.
                                    </td>
                                </tr>
                            ) : (
                                paginatedParticipants.map(reg => (
                                    <tr key={reg.id} style={{ borderBottom: `1px solid ${p.borderLight}` }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 500, color: p.text, fontSize: '13px' }}>{reg.user.fullName}</div>
                                            <div style={{ color: p.textFaint, fontSize: '12px', marginBottom: '8px' }}>{reg.user.email}</div>
                                            <div style={{ fontSize: '11px', color: p.textSub, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span style={{ color: reg.checkInAt ? '#059669' : p.textFaint }}>
                                                    📥 ĐẾN: {reg.checkInAt ? new Date(reg.checkInAt).toLocaleTimeString('vi-VN') : 'Chưa quét mã'}
                                                </span>
                                                <span style={{ color: reg.checkOutAt ? '#059669' : p.textFaint }}>
                                                    📤 VỀ: {reg.checkOutAt ? new Date(reg.checkOutAt).toLocaleTimeString('vi-VN') : 'Chưa quét mã'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            {reg.tasks && reg.tasks.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {reg.tasks.map((t: any) => (
                                                        <div key={t.id} style={{ 
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            backgroundColor: p.surfaceAlt,
                                                            padding: '6px 10px', borderRadius: '4px', fontSize: '12px',
                                                            border: `1px solid ${p.border}`
                                                        }}>
                                                            <span>
                                                                <strong style={{ color: p.textSub }}>{t.taskName}</strong>
                                                                {t.description && <span style={{ color: p.textFaint }}> - {t.description}</span>}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleRemoveTask(t.id)}
                                                                title="Thu hồi nhiệm vụ"
                                                                style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', lineHeight: 1 }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: p.textFaint, fontSize: '12px' }}>Chưa được phân công</span>
                                            )}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '200px', margin: '0 auto' }}>
                                                <select id={`taskType-${reg.id}`} style={inputStyle}>
                                                    <option value="Thành viên">Thành viên nhóm</option>
                                                    <option value="Điều phối viên">Điều phối viên</option>
                                                    <option value="Trưởng nhóm">Trưởng nhóm</option>
                                                    <option value="Hậu cần">Hậu cần / Kỹ thuật</option>
                                                </select>
                                                <input 
                                                    type="text" 
                                                    id={`taskDesc-${reg.id}`} 
                                                    placeholder="Ghi chú cụ thể..." 
                                                    style={inputStyle}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const typeSelect = document.getElementById(`taskType-${reg.id}`) as HTMLSelectElement;
                                                        const descInput = document.getElementById(`taskDesc-${reg.id}`) as HTMLInputElement;
                                                        handleAssign(reg.id, typeSelect.value, descInput.value);
                                                        descInput.value = '';
                                                    }}
                                                    style={btnPrimary}
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

            {selectedCampId && activeTab === 'kanban' && (
                <KanbanBoard campaignId={selectedCampId} />
            )}

            {selectedCampId && activeTab === 'chat' && (
                <ChatRoom campaignId={selectedCampId} />
            )}
        </div>
    );
}