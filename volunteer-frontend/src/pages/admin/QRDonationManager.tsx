
import { useState, useEffect, useMemo } from 'react';
import { QrCode, CheckCircle, XCircle, Search, Download, Filter, Calendar } from 'lucide-react';
import api from '../../config/axios';
export default function QRDonationManager() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State phục vụ việc tìm kiếm và lọc dữ liệu
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. GỌI API LẤY DANH SÁCH GIAO DỊCH THẬT TỪ BACKEND
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                // Gọi đến endpoint quản lý donation của Backend
                const response = await api.get('/payment/admin/donations');
                
                // Hứng dữ liệu (hỗ trợ cả dạng response thô hoặc bọc qua object data)
                const data = response.data.data || response.data;
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi khi kết nối API lấy danh sách quyên góp:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    // 2. GỌI API CẬP NHẬT TRẠNG THÁI GIAO DỊCH XUỐNG DATABASE
    const handleStatusChange = async (id: number, newStatus: string) => {
        const confirmMsg = newStatus === 'SUCCESS' 
            ? 'Xác nhận giao dịch này đã nhận được tiền thành công?' 
            : 'Xác nhận từ chối giao dịch quyên góp này?';

        if (window.confirm(confirmMsg)) {
            try {
                // Gọi API cập nhật trạng thái xuống MySQL
                await api.put(`/payment/admin/donations/${id}/status`, { status: newStatus });
                
                // Cập nhật lại state trực tiếp trên giao diện để hiển thị tức thì
                setTransactions(prev => 
                    prev.map(t => t.id === id ? { ...t, status: newStatus } : t)
                );
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái giao dịch:", error);
                alert("Không thể cập nhật trạng thái xuống cơ sở dữ liệu. Vui lòng kiểm tra lại Backend!");
            }
        }
    };

    // 3. LOGIC LỌC VÀ TÌM KIẾM DỮ LIỆU TRÊN FRONTEND
    useEffect(() => {
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm hoặc lọc
    }, [searchTerm, selectedStatus]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Lọc theo trạng thái (PENDING, SUCCESS, REJECTED)
            const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
            
            // Tìm kiếm theo mã giao dịch (orderId) hoặc tên/MSSV sinh viên (nếu Backend có join kèm)
            const searchLower = searchTerm.toLowerCase();
            const studentName = t.studentName || t.user?.name || '';
            const studentId = t.studentId || t.user?.studentId || '';
            const orderId = t.orderId || '';

            const matchesSearch = orderId.toLowerCase().includes(searchLower) ||
                                 studentName.toLowerCase().includes(searchLower) ||
                                 studentId.includes(searchTerm);

            return matchesStatus && matchesSearch;
        });
    }, [transactions, searchTerm, selectedStatus]);

    // 4. PHÂN TRANG
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Tiêu đề trang */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <QrCode className="text-orange-600" /> Quản lý Giao dịch Quyên góp
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Danh sách lịch sử giao dịch thời gian thực từ bảng dữ liệu quyên góp
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-2xs transition-colors">
                    <Download size={16} /> Xuất file Excel
                </button>
            </div>

            {/* Thanh công cụ: Tìm kiếm & Lọc trạng thái */}
            <div className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã giao dịch (DONATE...), tên sinh viên hoặc MSSV..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all" 
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="text-slate-400" size={16} />
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="All">-- Tất cả trạng thái --</option>
                        <option value="PENDING">Chờ xử lý (PENDING)</option>
                        <option value="SUCCESS">Thành công (SUCCESS)</option>
                        <option value="REJECTED">Đã hủy (REJECTED)</option>
                    </select>
                </div>
            </div>

            {/* Bảng hiển thị danh sách giao dịch */}
            <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[950px]">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
                                <th className="px-6 py-4">Mã đơn (ID) / Ngày tạo</th>
                                <th className="px-6 py-4">Mã Giao Dịch (OrderId)</th>
                                <th className="px-6 py-4">Sinh viên quyên góp</th>
                                <th className="px-6 py-4">Khoa</th>
                                <th className="px-6 py-4">Chiến dịch (ID)</th>
                                <th className="px-6 py-4">Số tiền (Amount)</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu từ cơ sở dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Cột ID & Ngày */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-700">#{t.id}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                                <Calendar size={12} />
                                                {t.createdAt ? new Date(t.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                            </div>
                                        </td>
                                        
                                        {/* Cột OrderId */}
                                        <td className="px-6 py-4 font-mono text-xs text-slate-800 font-bold select-all">
                                            {t.orderId}
                                        </td>
                                        
                                        {/* Cột Tên sinh viên (Hỗ trợ linh hoạt cấu trúc trả về) */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-slate-900">{t.studentName || t.user?.name || 'Sinh viên ẩn danh'}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 font-medium">MSSV: {t.studentId || t.user?.studentId || 'N/A'}</div>
                                        </td>
                                        
                                        {/* Cột Khoa */}
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                                            {t.faculty || t.user?.faculty || 'Hệ thống'}
                                        </td>
                                        
                                        {/* Cột Chiến dịch */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700 line-clamp-1">{t.campaignName || 'Tên chiến dịch'}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 font-medium">Mã chiến dịch: {t.campaignId}</div>
                                        </td>
                                        
                                        {/* Cột Số tiền */}
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                                            {Number(t.amount).toLocaleString('vi-VN')} đ
                                        </td>
                                        
                                        {/* Cột Trạng thái */}
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {t.status === 'PENDING' && (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    PENDING
                                                </span>
                                            )}
                                            {t.status === 'SUCCESS' && (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    SUCCESS
                                                </span>
                                            )}
                                            {t.status === 'REJECTED' && (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                    REJECTED
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Cột hành động duyệt */}
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {t.status === 'PENDING' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleStatusChange(t.id, 'SUCCESS')} 
                                                        className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" 
                                                        title="Xác nhận thành công"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusChange(t.id, 'REJECTED')} 
                                                        className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" 
                                                        title="Từ chối đơn"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic select-none">Đã xử lý</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                                        Không có dữ liệu giao dịch quyên góp nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Phân trang UI */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/50">
                        <span className="text-sm text-slate-500">
                            Hiển thị <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> trong tổng số <span className="font-semibold text-slate-700">{filteredTransactions.length}</span> giao dịch
                        </span>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                            >
                                Trước
                            </button>
                            <div className="flex gap-1 hidden sm:flex">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-orange-500 text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}