import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { GraduationCap, PlusCircle, Trash2, BookOpen } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle, getLabelStyle,
    getBtnDelete, getSectionCard, getSectionHeader, getH2Style, getSubText,
    palette
} from '../../styles/adminTheme';

export default function ManageFaculties() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [faculties, setFaculties] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Style constants (theme-aware)
    const labelStyle = getLabelStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const btnDelete = getBtnDelete(isDark);

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/faculties');
            setFaculties(res.data.data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách khoa:", error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const handleAddFaculty = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Vui lòng nhập tên khoa!");

        setLoading(true);
        try {
            await api.post('/faculties', { name: name.trim() });
            alert("✅ Thêm Khoa thành công!");
            setName('');
            fetchFaculties();
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi thêm Khoa (có thể tên đã tồn tại)!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này không?\nTất cả dữ liệu liên quan có thể bị ảnh hưởng.")) return;

        try {
            await api.delete(`/faculties/${id}`);
            alert("Đã xóa khoa thành công!");
            fetchFaculties();
        } catch (error: any) {
            alert(error.response?.data?.error || "Không thể xóa khoa này!");
        }
    };

    const totalPages = Math.ceil(faculties.length / itemsPerPage);
    const paginatedFaculties = faculties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <GraduationCap size={22} color="#2563eb" />
                <div>
                    <h2 style={{ ...getH2Style(isDark), margin: 0 }}>Quản lý Khoa</h2>
                    <p style={getSubText(isDark)}>Thêm và quản lý các khoa trong hệ thống</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                
                {/* Form thêm Khoa mới */}
                <div style={{ backgroundColor: p.surfaceAlt, padding: '20px', borderRadius: '6px', border: `1px solid ${p.border}`, height: 'fit-content' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: p.textSub, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PlusCircle size={16} color="#2563eb" /> Thêm Khoa Mới
                    </h4>

                    <form onSubmit={handleAddFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>
                                Tên Khoa <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                placeholder="Ví dụ: Khoa Công nghệ Thông tin"
                                style={inputStyle}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !name.trim()}
                            style={{
                                padding: '9px 16px',
                                backgroundColor: loading || !name.trim() ? '#9ca3af' : '#2563eb',
                                color: 'white', border: 'none', borderRadius: '6px',
                                fontWeight: 600, cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            {loading ? 'Đang thêm...' : 'Thêm Khoa'}
                        </button>
                    </form>
                </div>

                {/* Danh sách Khoa */}
                <div style={getSectionCard(isDark)}>
                    <div style={{ ...getSectionHeader(isDark), justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={16} color="#2563eb" />
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: p.textSub }}>Danh sách Khoa hiện có</h4>
                        </div>
                        <span style={{ fontSize: '12px', color: p.textMuted }}>
                            Tổng cộng: <strong>{faculties.length}</strong> khoa
                        </span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Tên Khoa</th>
                                <th style={{ ...thStyle, textAlign: 'center', width: '80px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFaculties.map((faculty) => (
                                <tr key={faculty.id}>
                                    <td style={{ ...tdStyle, fontWeight: 500, color: p.text }}>
                                        {faculty.name}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleDelete(faculty.id)}
                                            style={btnDelete}
                                            title="Xóa khoa"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {faculties.length === 0 && (
                                <tr>
                                    <td colSpan={2} style={{ textAlign: 'center', padding: '32px', color: p.textFaint, fontSize: '13px' }}>
                                        Chưa có khoa nào được thêm. Hãy thêm khoa mới ở bên trái.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {faculties.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={faculties.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}