import { useState, useEffect } from 'react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';

export default function EvaluateVolunteers() {
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

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Đánh giá & Ghi nhận Đóng góp</h2>
                <p className="text-gray-600 mt-2">Chọn chiến dịch đã hoàn thành để đánh giá tình nguyện viên</p>
            </div>

            {/* 👇 CỤM BỘ LỌC (Chiến dịch + Khoa) */}
            <div className="mb-8 flex flex-col md:flex-row gap-6">
                
                {/* Chọn chiến dịch */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn chiến dịch đã tổ chức
                    </label>
                    <select 
                        onChange={(e) => {
                            const selectedCamp = campaigns.find(c => c.id === Number(e.target.value));
                            if (selectedCamp) {
                                fetchParticipants(Number(e.target.value), selectedCamp.title);
                            }
                        }} 
                        defaultValue="" 
                        className="w-full lg:w-[420px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="" disabled>-- Chọn chiến dịch để đánh giá --</option>
                        {campaigns.map(camp => (
                            <option key={camp.id} value={camp.id}>
                                {camp.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chọn Khoa (Mới thêm) */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lọc theo Khoa sinh viên
                    </label>
                    <select 
                        value={selectedFacultyId}
                        onChange={(e) => setSelectedFacultyId(e.target.value)}
                        disabled={!selectedCampId} // Khóa ô này lại nếu chưa chọn chiến dịch
                        className="w-full lg:w-[420px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">-- Tất cả các Khoa --</option>
                        {faculties.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng đánh giá */}
            {selectedCampId && (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                            {selectedCampaignTitle}
                        </h3>
                        {/* 👇 Đổi lại hiển thị số lượng của mảng đã lọc */}
                        <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Đang hiển thị: {filteredParticipants.length} sinh viên
                        </span>
                    </div>

                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tình nguyện viên</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khoa</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nhận xét / Đánh giá</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-32">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                        Không có tình nguyện viên nào.
                                    </td>
                                </tr>
                            ) : (
                                paginatedParticipants.map((reg) => {
                                    const inputId = `note-${reg.id}`;

                                    return (
                                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-gray-800">
                                                    {reg.user?.fullName || 'Không có tên'}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {reg.user?.email}
                                                </div>
                                            </td>
                                            {/* 👇 Cột hiển thị tên Khoa */}
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                                    {reg.user?.faculty?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <textarea
                                                    id={inputId}
                                                    defaultValue={reg.notes || ''}
                                                    placeholder="Nhập nhận xét, đánh giá đóng góp của tình nguyện viên..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() => {
                                                        const textarea = document.getElementById(inputId) as HTMLTextAreaElement;
                                                        if (textarea) {
                                                            handleSaveNote(reg.id, textarea.value);
                                                        }
                                                    }}
                                                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all shadow-sm w-full whitespace-nowrap"
                                                >
                                                    💾 Lưu lại
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
                <div className="bg-white rounded-2xl shadow p-16 text-center">
                    <div className="text-6xl mb-6">📝</div>
                    <p className="text-xl text-gray-500">Vui lòng chọn một chiến dịch để bắt đầu đánh giá</p>
                </div>
            )}
        </div>
    );
}