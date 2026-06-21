import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Filter, Trash2 } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function ManageUsers() {
    const [users, setUsers] = useState<any[]>([]);
    
    // 👇 THÊM STATE CHO BỘ LỌC KHOA
    const [faculties, setFaculties] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Lấy dữ liệu khi vừa vào trang
    useEffect(() => {
        // Lấy danh sách users
        api.get('/users')
           .then(res => setUsers(res.data.data))
           .catch(console.error);
           
        // Lấy danh sách các Khoa để đưa vào Dropdown
        api.get('/faculties')
           .then(res => setFaculties(res.data.data))
           .catch(console.error);
    }, []);

    // Xử lý đổi quyền (Phân quyền Admin / Tình nguyện viên)
    const handleUpdateRole = async (userId: number, newRole: string) => {
        if (!window.confirm(`Bạn có chắc muốn đổi quyền thành ${newRole}?`)) return;
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert("Cập nhật quyền thành công!");
        } catch (error) { alert("Lỗi khi cập nhật quyền!"); }
    };

    // Xử lý xóa tài khoản
    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng này và toàn bộ lịch sử của họ không?")) return;
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
            alert("Đã xóa người dùng thành công!");
        } catch (error) { alert("Lỗi khi xóa người dùng!"); }
    };

    // 👇 LOGIC LỌC DỮ LIỆU TÀI KHOẢN THEO KHOA
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFacultyId]);

    const filteredUsers = selectedFacultyId 
        ? users.filter(u => u.faculty?.id?.toString() === selectedFacultyId)
        : users;

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#2563eb" /> Quản lý Tài khoản Hệ thống
            </h2>

            {/* BỘ LỌC TÌM KIẾM */}
            <div style={{ marginBottom: '16px', backgroundColor: '#fafafa', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <div style={{ maxWidth: '360px' }}>
                    <label style={{ fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#374151' }}>
                        <Filter size={13}/> Lọc tài khoản theo Khoa:
                    </label>
                    <select 
                        value={selectedFacultyId} 
                        onChange={e => setSelectedFacultyId(e.target.value)} 
                        style={inputStyle}
                    >
                        <option value="">-- Hiện tất cả các Khoa --</option>
                        {faculties.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* BẢNG DANH SÁCH TÀI KHOẢN */}
            <div style={{ backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>Danh sách Tài khoản</h4>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        Tổng số: <strong>{filteredUsers.length}</strong> tài khoản
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={thStyle}>Họ và Tên</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Khoa trực thuộc</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Quyền hạn</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ ...tdStyle, fontWeight: 500, color: '#111827' }}>{user.fullName}</td>
                                <td style={{ ...tdStyle, color: '#6b7280' }}>{user.email}</td>
                                
                                {/* HIỂN THỊ KHOA */}
                                <td style={tdStyle}>
                                    {user.faculty ? (
                                        <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                            {user.faculty.name}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px' }}>Chưa cập nhật</span>
                                    )}
                                </td>

                                {/* CỘT QUYỀN HẠN (Có thể bấm để đổi) */}
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                        style={{ 
                                            padding: '5px 8px', borderRadius: '4px', border: '1px solid #d1d5db', 
                                            backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#f9fafb',
                                            color: user.role === 'ADMIN' ? '#15803d' : '#374151',
                                            fontWeight: 500, cursor: 'pointer', outline: 'none', fontSize: '12px'
                                        }}
                                    >
                                        <option value="VOLUNTEER">Tình nguyện viên</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </td>

                                {/* NÚT XÓA */}
                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)} 
                                        title="Xóa tài khoản" 
                                        style={btnDelete}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '13px' }}>
                                    Không có tài khoản nào thuộc Khoa này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db',
    outline: 'none', backgroundColor: '#ffffff', fontSize: '13px'
};
const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '10px 14px', fontSize: '13px' };
const btnDelete: React.CSSProperties = { border: 'none', background: '#fee2e2', color: '#dc2626', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' };