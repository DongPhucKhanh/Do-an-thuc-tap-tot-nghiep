import { useState, useEffect } from 'react';
import api from '../../config/axios';
import Pagination from '../../components/admin/Pagination';

export default function ManageCampaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    
    // 🌟 CÁC STATE QUẢN LÝ PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 5; // Hiển thị 5 chiến dịch mỗi trang

    // 🌟 CÁC STATE QUẢN LÝ MODAL CHỈNH SỬA
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file ảnh mới chọn
    const [previewUrl, setPreviewUrl] = useState<string>(''); // Lưu link preview ảnh xem trước

    useEffect(() => {
        fetchCampaigns(currentPage);
    }, [currentPage]);

    const fetchCampaigns = async (page: number) => {
        try {
            // Gửi params phân trang lên backend
            const response = await api.get(`/campaigns?page=${page}&limit=${limit}`);
            
            // Tùy theo cấu trúc trả về, bóc tách mảng dữ liệu và thông tin phân trang
            setCampaigns(response.data.data || response.data);
            if (response.data.pagination) {
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Khi click chọn nút Sửa
    const handleEditClick = (campaign: any) => {
        setEditingCampaign({ ...campaign });
        setSelectedFile(null);
        setPreviewUrl(campaign.image ? `http://localhost:5000${campaign.image}` : '');
        setIsEditModalOpen(true);
    };

    // Xử lý khi chọn file ảnh từ máy tính
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo link ảo để hiển thị xem trước ảnh ngay lập tức
        }
    };

    // Gửi form cập nhật bằng FormData lên Backend
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Đóng gói FormData bắt buộc khi có truyền tải Tệp tin (File)
        const formData = new FormData();
        formData.append('title', editingCampaign.title);
        formData.append('location', editingCampaign.location);
        formData.append('description', editingCampaign.description);
        formData.append('requiredVolunteers', editingCampaign.requiredVolunteers);
        if (editingCampaign.lat) formData.append('lat', editingCampaign.lat);
        if (editingCampaign.lng) formData.append('lng', editingCampaign.lng);
        
        // Nếu có chọn file ảnh mới thì nạp vào FormData
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            await api.put(`/campaigns/${editingCampaign.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Ép kiểu header định dạng file
            });
            alert('🎉 Cập nhật thông tin và hình ảnh chiến dịch thành công!');
            setIsEditModalOpen(false);
            fetchCampaigns(currentPage); // Reset lại danh sách trang hiện tại
        } catch (error: any) {
            alert(error.response?.data?.error || 'Lỗi khi cập nhật dữ liệu');
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
        const action = newStatus === 'OPEN' ? 'MỞ' : 'TẠM DỪNG';

        if (!window.confirm(`Bạn muốn chuyển trạng thái chiến dịch thành "${action}"?`)) return;

        try {
            await api.patch(`/campaigns/${id}`, { status: newStatus });
            fetchCampaigns(currentPage);
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi cập nhật trạng thái");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("CẢNH BÁO: Xóa chiến dịch này sẽ xóa luôn tất cả đơn đăng ký. Bạn chắc chắn muốn xóa?")) return;

        try {
            await api.delete(`/campaigns/${id}`);
            alert("Đã xóa chiến dịch thành công!");
            fetchCampaigns(currentPage);
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi xóa chiến dịch");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Quản lý Chiến dịch</h2>
                <div className="text-sm text-gray-500">
                    Tổng số: <span className="font-semibold text-gray-700">{totalItems || campaigns.length}</span> chiến dịch
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên hoạt động</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Địa điểm</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hình ảnh</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {campaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-blue-600 text-base max-w-[220px]">
                                        {camp.title}
                                    </div>
                                </td>

                                <td className="px-6 py-5 text-xs text-gray-600">
                                    <div>Từ: <span className="font-medium">{new Date(camp.startDate).toLocaleDateString('vi-VN')}</span></div>
                                    <div className="mt-0.5">Đến: <span className="font-medium">{new Date(camp.endDate).toLocaleDateString('vi-VN')}</span></div>
                                </td>

                                <td className="px-6 py-5 text-xs text-gray-500 max-w-[150px] truncate">
                                    📍 {camp.location || 'Chưa cập nhật'}
                                </td>

                                <td className="px-6 py-5">
                                    {camp.image ? (
                                        <img
                                            src={`http://localhost:5000${camp.image}`}
                                            key={camp.image}
                                            alt={camp.title}
                                            className="w-16 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                                            onError={(e) => {
                                                // Mẹo nhỏ: Nếu file không tồn tại thực tế thì đổi sang ảnh nền xám báo lỗi
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x80/e2e8f0/94a3b8?text=Loi+File';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[10px]">
                                            Không có ảnh
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-5">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full
                                        ${camp.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {camp.status === 'OPEN' ? 'ĐANG MỞ' : 'TẠM DỪNG'}
                                    </span>
                                </td>

                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center">
                                        {/* NÚT SỬA ĐƯỢC BỔ SUNG */}
                                        <button onClick={() => handleEditClick(camp)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                                            Sửa
                                        </button>
                                        <button onClick={() => handleToggleStatus(camp.id, camp.status)} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${camp.status === 'OPEN' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                            {camp.status === 'OPEN' ? 'Tạm dừng' : 'Mở lại'}
                                        </button>
                                        <button onClick={() => handleDelete(camp.id)} className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {campaigns.length === 0 && (
                    <div className="text-center py-12 text-gray-500">Chưa có chiến dịch nào được tạo.</div>
                )}
            </div>

            {/* ================= BAR PHÂN TRANG (PAGINATION) ================= */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems || campaigns.length}
                itemsPerPage={limit}
                onPageChange={setCurrentPage}
            />

            {/* ================= MODAL CỬA SỔ POPUP SỬA CHIẾN DỊCH VÀ HÌNH ẢNH ================= */}
            {isEditModalOpen && editingCampaign && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border">
                        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase">✏️ Chỉnh sửa Chiến dịch #{editingCampaign.id}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white font-bold">✕</button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
                            <label className="block space-y-1">
                                <span className="font-bold text-gray-700">Tên chiến dịch:</span>
                                <input type="text" value={editingCampaign.title} onChange={e => setEditingCampaign({...editingCampaign, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-medium" required />
                            </label>

                            <label className="block space-y-1">
                                <span className="font-bold text-gray-700">Địa điểm diễn ra:</span>
                                <input type="text" value={editingCampaign.location || ''} onChange={e => setEditingCampaign({...editingCampaign, location: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 text-gray-600" required />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Số lượng TNV:</span>
                                    <input type="number" value={editingCampaign.requiredVolunteers || ''} onChange={e => setEditingCampaign({...editingCampaign, requiredVolunteers: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" required />
                                </label>
                                <label className="block space-y-1">
                                    <span className="font-bold text-gray-700">Danh mục ID:</span>
                                    <input type="number" value={editingCampaign.categoryId || ''} onChange={e => setEditingCampaign({...editingCampaign, categoryId: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500" />
                                </label>
                            </div>

                            {/* KHU VỰC ĐỔI HÌNH ẢNH MỚI THỰC TẾ */}
                            <div className="block space-y-2 border-t pt-2">
                                <span className="font-bold text-gray-700 block">Hình ảnh hoạt động:</span>
                                {previewUrl && (
                                    <img src={previewUrl} className="w-32 h-20 object-cover rounded-lg border shadow-xs mx-auto block mb-2" alt="Preview" />
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border font-bold text-gray-500 rounded-xl hover:bg-gray-50">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm">Lưu thay đổi</button>
							</div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}