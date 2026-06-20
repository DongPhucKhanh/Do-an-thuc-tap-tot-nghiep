import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Eye, X, Calendar, MapPin } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function StudentActivities() {
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                    <Users size={28} className="text-emerald-600" /> 
                    Theo dõi hoạt động Sinh viên
                </h2>
            </div>

            {/* Bộ lọc Khoa */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lọc theo Khoa:
                </label>
                <select 
                    value={selectedFacultyId} 
                    onChange={e => setSelectedFacultyId(e.target.value)} 
                    className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                    <option value="">-- Tất cả các Khoa --</option>
                    {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Họ và Tên</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khoa</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Số chiến dịch</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {user.fullName || 'Chưa có tên'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-md">
                                        {user.faculty?.name || 'Không có khoa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-semibold text-emerald-600 text-lg">
                                        {user.registrations?.length || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                        Xem lịch sử
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Lịch sử hoạt động</h3>
                                <p className="text-emerald-600 font-medium">{selectedUser.fullName}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Nội dung Modal */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {selectedUser.registrations?.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedUser.registrations.map((reg: any) => (
                                        <div 
                                            key={reg.id} 
                                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <strong className="text-gray-800 pr-4">
                                                    {reg.campaign?.title}
                                                </strong>
                                                <span className={`text-xs px-3 py-1 rounded font-medium
                                                    ${reg.status === 'APPROVED' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {reg.status === 'APPROVED' ? 'Đã tham gia' : 'Chờ duyệt'}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} />
                                                    {reg.campaign?.location || 'Không có địa điểm'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {reg.campaign?.startDate 
                                                        ? new Date(reg.campaign.startDate).toLocaleDateString('vi-VN') 
                                                        : 'Chưa có ngày'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
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