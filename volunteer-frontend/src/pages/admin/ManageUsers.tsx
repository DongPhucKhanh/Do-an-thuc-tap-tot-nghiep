import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Filter, Shield, User, Trash2 } from 'lucide-react';
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
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e1e2d', marginBottom: '25px' }}>
                <Users size={28} color="#0984e3" /> Quản lý Tài khoản Hệ thống
            </h2>

            {/* BỘ LỌC TÌM KIẾM */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1, maxWidth: '400px' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Filter size={16}/> Lọc tài khoản theo Khoa:
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
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0 }}>Danh sách Tài khoản</h4>
                    <span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '6px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                        Tổng số: {filteredUsers.length} tài khoản
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f2f6', color: '#636e72', backgroundColor: '#fafafa' }}>
                            <th style={{ padding: '12px 10px' }}>Họ và Tên</th>
                            <th style={{ padding: '12px 10px' }}>Email</th>
                            <th style={{ padding: '12px 10px' }}>Khoa trực thuộc</th>
                            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Quyền hạn</th>
                            <th style={{ padding: '12px 10px', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user, index) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f2f6', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#2d3436' }}>{user.fullName}</td>
                                <td style={{ padding: '12px 10px', color: '#636e72' }}>{user.email}</td>
                                
                                {/* HIỂN THỊ KHOA */}
                                <td style={{ padding: '12px 10px' }}>
                                    {user.faculty ? (
                                        <span style={{ backgroundColor: '#f3e5f5', color: '#8e44ad', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                                            {user.faculty.name}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#b2bec3', fontStyle: 'italic', fontSize: '13px' }}>Chưa cập nhật</span>
                                    )}
                                </td>

                                {/* CỘT QUYỀN HẠN (Có thể bấm để đổi) */}
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                        style={{ 
                                            padding: '6px 10px', borderRadius: '6px', border: '1px solid #dfe6e9', 
                                            backgroundColor: user.role === 'ADMIN' ? '#e8f8f5' : '#f1f2f6',
                                            color: user.role === 'ADMIN' ? '#00b894' : '#2d3436',
                                            fontWeight: 'bold', cursor: 'pointer', outline: 'none'
                                        }}
                                    >
                                        <option value="VOLUNTEER">Tình nguyện viên</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </td>

                                {/* NÚT XÓA */}
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)} 
                                        title="Xóa tài khoản" 
                                        style={{ border: 'none', background: '#ffeaa7', color: '#d63031', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#b2bec3' }}>
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

const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #dfe6e9', outline: 'none', backgroundColor: '#fdfdfd', fontSize: '14px'
};