import { useState, useEffect } from 'react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle, getLabelStyle, getBtnSave,
    getFilterPanel, getSectionCard, getSectionHeader, palette
} from '../../styles/adminTheme';

export default function EvaluateVolunteers() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampId, setSelectedCampId] = useState<number | null>(null);
    const [selectedCampaignTitle, setSelectedCampaignTitle] = useState<string>('');
    const [participants, setParticipants] = useState<any[]>([]);

    // 👇 THÊM STATE CHO KHOA
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Tải danh sách chiến dịch & danh sách Khoa
    useEffect(() => {
        api.get('/campaigns')
            .then(res => setCampaigns(res.data.data || res.data))
            .catch(console.error);
            
        // Gọi thêm API lấy danh sách Khoa
        api.get('/faculties')
            .then(res => setFaculties(res.data.data || res.data))
            .catch(console.error);
    }, []);

    // Lấy danh sách tình nguyện viên đã được duyệt
    const fetchParticipants = async (campaignId: number, title: string) => {
        try {
            const response = await api.get(`/campaigns/${campaignId}/registrations`);
            // Chỉ lấy những người đã được duyệt (APPROVED)
            const approvedUsers = response.data.data.filter((reg: any) => reg.status === 'APPROVED');
            setParticipants(approvedUsers);
            setSelectedCampId(campaignId);
            setSelectedCampaignTitle(title);
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi tải danh sách tình nguyện viên");
        }
    };

    // Lưu đánh giá / nhận xét
    const handleSaveNote = async (regId: number, notes: string) => {
        if (!notes.trim()) {
            alert("Vui lòng nhập nội dung đánh giá trước khi lưu!");
            return;
        }

        try {
            await api.patch(`/campaigns/registrations/${regId}/evaluate`, { notes });
            alert("✅ Đã lưu đánh giá thành công!");
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi lưu đánh giá");
        }
    };

    // 👇 LOGIC LỌC TÌNH NGUYỆN VIÊN THEO KHOA
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCampId, selectedFacultyId]);

    const filteredParticipants = selectedFacultyId 
        ? participants.filter(reg => {
            // Đảm bảo hỗ trợ cả cấu trúc dữ liệu lồng nhau (faculty.id) hoặc trực tiếp (facultyId)
            const facId = reg.user?.faculty?.id || reg.user?.facultyId;
            return facId?.toString() === selectedFacultyId;
          })
        : participants;

    const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
    const paginatedParticipants = filteredParticipants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const labelStyle = getLabelStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const btnSave = getBtnSave(isDark);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600, color: p.text }}>Đánh giá & Ghi nhận Đóng góp</h2>
                <p style={{ margin: 0, fontSize: '13px', color: p.textMuted }}>Chọn chiến dịch đã hoàn thành để đánh giá tình nguyện viên</p>
            </div>

            {/* CỤM BỘ LỌC (Chiến dịch + Khoa) */}
            <div style={{ ...getFilterPanel(isDark), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* Chọn chiến dịch */}
                <div>
                    <label style={labelStyle}>Chọn chiến dịch đã tổ chức</label>
                    <select 
                        onChange={(e) => {
                            const selectedCamp = campaigns.find(c => c.id === Number(e.target.value));
                            if (selectedCamp) {
                                fetchParticipants(Number(e.target.value), selectedCamp.title);
                            }
                        }} 
                        defaultValue="" 
                        style={inputStyle}
                    >
                        <option value="" disabled>-- Chọn chiến dịch để đánh giá --</option>
                        {campaigns.map(camp => (
                            <option key={camp.id} value={camp.id}>{camp.title}</option>
                        ))}
                    </select>
                </div>

                {/* Chọn Khoa */}
                <div>
                    <label style={labelStyle}>Lọc theo Khoa sinh viên</label>
                    <select 
                        value={selectedFacultyId}
                        onChange={(e) => setSelectedFacultyId(e.target.value)}
                        disabled={!selectedCampId}
                        style={{ ...inputStyle, opacity: !selectedCampId ? 0.5 : 1 }}
                    >
                        <option value="">-- Tất cả các Khoa --</option>
                        {faculties.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng đánh giá */}
            {selectedCampId && (
                <div style={getSectionCard(isDark)}>
                    <div style={{ ...getSectionHeader(isDark), justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: p.textSub }}>{selectedCampaignTitle}</h4>
                        <span style={{ fontSize: '12px', color: p.textMuted }}>
                            Đang hiển thị: <strong>{filteredParticipants.length}</strong> sinh viên
                        </span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: p.surfaceAlt, borderBottom: `1px solid ${p.border}` }}>
                                <th style={thStyle}>Tình nguyện viên</th>
                                <th style={thStyle}>Khoa</th>
                                <th style={thStyle}>Nhận xét / Đánh giá</th>
                                <th style={{ ...thStyle, textAlign: 'center', width: '100px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: p.textFaint, fontSize: '13px' }}>
                                        Không có tình nguyện viên nào.
                                    </td>
                                </tr>
                            ) : (
                                paginatedParticipants.map((reg) => {
                                    const inputId = `note-${reg.id}`;
                                    return (
                                        <tr key={reg.id} style={{ borderBottom: `1px solid ${p.borderLight}` }}>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: 500, color: p.text, fontSize: '13px' }}>
                                                    {reg.user?.fullName || 'Không có tên'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: p.textFaint }}>
                                                    {reg.user?.email}
                                                </div>
                                            </td>
                                            {/* Cột hiển thị tên Khoa */}
                                            <td style={tdStyle}>
                                                <span style={{ backgroundColor: isDark ? '#263244' : '#f3f4f6', color: p.textSub, padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                                    {reg.user?.faculty?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <textarea
                                                    id={inputId}
                                                    defaultValue={reg.notes || ''}
                                                    placeholder="Nhập nhận xét, đánh giá đóng góp của tình nguyện viên..."
                                                    rows={3}
                                                    style={{ width: '100%', padding: '8px 10px', border: `1px solid ${p.border}`, borderRadius: '6px', outline: 'none', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', backgroundColor: p.surface, color: p.text }}
                                                />
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        const textarea = document.getElementById(inputId) as HTMLTextAreaElement;
                                                        if (textarea) {
                                                            handleSaveNote(reg.id, textarea.value);
                                                        }
                                                    }}
                                                    style={btnSave}
                                                >
                                                    Lưu lại
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    {filteredParticipants.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredParticipants.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}

            {!selectedCampId && (
                <div style={{ backgroundColor: p.surface, border: `1px solid ${p.border}`, borderRadius: '6px', padding: '48px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: p.textMuted }}>Vui lòng chọn một chiến dịch để bắt đầu đánh giá</p>
                </div>
            )}
        </div>
    );
}