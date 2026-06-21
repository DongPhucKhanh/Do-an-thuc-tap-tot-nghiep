
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
        <div>
            {/* Tiêu đề trang */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <QrCode size={20} color="#ea580c" /> Quản lý Giao dịch Quyên góp
                    </h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        Danh sách lịch sử giao dịch thời gian thực từ bảng dữ liệu quyên góp
                    </p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    <Download size={14} /> Xuất file Excel
                </button>
            </div>

            {/* Thanh công cụ: Tìm kiếm & Lọc trạng thái */}
            <div style={{ backgroundColor: 'white', padding: '14px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={15} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã giao dịch, tên sinh viên hoặc MSSV..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#fafafa', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} 
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '200px' }}>
                    <Filter size={14} color="#9ca3af" />
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ flex: 1, padding: '8px 10px', backgroundColor: '#fafafa', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '13px', color: '#374151', cursor: 'pointer' }}
                    >
                        <option value="All">-- Tất cả trạng thái --</option>
                        <option value="PENDING">Chờ xử lý (PENDING)</option>
                        <option value="SUCCESS">Thành công (SUCCESS)</option>
                        <option value="REJECTED">Đã hủy (REJECTED)</option>
                    </select>
                </div>
            </div>

            {/* Bảng hiển thị danh sách giao dịch */}
            <div style={{ backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={thStyle}>Mã đơn (ID) / Ngày tạo</th>
                                <th style={thStyle}>Mã Giao Dịch (OrderId)</th>
                                <th style={thStyle}>Sinh viên quyên góp</th>
                                <th style={thStyle}>Khoa</th>
                                <th style={thStyle}>Chiến dịch (ID)</th>
                                <th style={thStyle}>Số tiền (Amount)</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Trạng thái</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '13px' }}>
                                        Đang tải dữ liệu từ cơ sở dữ liệu...
                                    </td>
                                </tr>
                            ) : paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        {/* Cột ID & Ngày */}
                                        <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                            <div style={{ fontWeight: 600, color: '#111827' }}>#{t.id}</div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                                <Calendar size={11} />
                                                {t.createdAt ? new Date(t.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                            </div>
                                        </td>
                                        
                                        {/* Cột OrderId */}
                                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                                            {t.orderId}
                                        </td>
                                        
                                        {/* Cột Tên sinh viên */}
                                        <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                            <div style={{ fontWeight: 500, color: '#111827' }}>{t.studentName || t.user?.name || 'Sinh viên ẩn danh'}</div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>MSSV: {t.studentId || t.user?.studentId || 'N/A'}</div>
                                        </td>
                                        
                                        {/* Cột Khoa */}
                                        <td style={{ ...tdStyle, color: '#2563eb', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                            {t.faculty || t.user?.faculty || 'Hệ thống'}
                                        </td>
                                        
                                        {/* Cột Chiến dịch */}
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{t.campaignName || 'Tên chiến dịch'}</div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af' }}>Mã chiến dịch: {t.campaignId}</div>
                                        </td>
                                        
                                        {/* Cột Số tiền */}
                                        <td style={{ ...tdStyle, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                                            {Number(t.amount).toLocaleString('vi-VN')} đ
                                        </td>
                                        
                                        {/* Cột Trạng thái */}
                                        <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            {t.status === 'PENDING' && (
                                                <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>
                                                    PENDING
                                                </span>
                                            )}
                                            {t.status === 'SUCCESS' && (
                                                <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                                                    SUCCESS
                                                </span>
                                            )}
                                            {t.status === 'REJECTED' && (
                                                <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                                                    REJECTED
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Cột hành động duyệt */}
                                        <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            {t.status === 'PENDING' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                    <button 
                                                        onClick={() => handleStatusChange(t.id, 'SUCCESS')} 
                                                        style={btnApprove}
                                                        title="Xác nhận thành công"
                                                    >
                                                        <CheckCircle size={15} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusChange(t.id, 'REJECTED')} 
                                                        style={btnReject}
                                                        title="Từ chối đơn"
                                                    >
                                                        <XCircle size={15} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Đã xử lý</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '13px' }}>
                                        Không có dữ liệu giao dịch quyên góp nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Phân trang UI */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến <strong>{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</strong> trong tổng số <strong>{filteredTransactions.length}</strong> giao dịch
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={paginBtn}
                            >
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    style={{
                                        ...paginBtn,
                                        backgroundColor: currentPage === page ? '#2563eb' : 'white',
                                        color: currentPage === page ? 'white' : '#374151',
                                        borderColor: currentPage === page ? '#2563eb' : '#d1d5db'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={paginBtn}
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

const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' };
const tdStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '13px', verticalAlign: 'top' };
const btnApprove: React.CSSProperties = { padding: '6px', color: '#059669', backgroundColor: '#dcfce7', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const btnReject: React.CSSProperties = { padding: '6px', color: '#dc2626', backgroundColor: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const paginBtn: React.CSSProperties = { padding: '5px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', backgroundColor: 'white', color: '#374151' };