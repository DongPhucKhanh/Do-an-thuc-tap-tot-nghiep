import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { FolderPlus, Trash2, List } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import { useTheme } from '../../context/ThemeContext';
import {
    getThStyle, getTdStyle, getInputStyle, getLabelStyle,
    getBtnPrimary, getBtnDelete, getSectionCard, getSectionHeader, getH2Style,
    palette
} from '../../styles/adminTheme';

export default function ManageCategories() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Style constants (theme-aware)
    const labelStyle = getLabelStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const thStyle = getThStyle(isDark);
    const tdStyle = getTdStyle(isDark);
    const btnPrimary = getBtnPrimary(isDark);
    const btnDelete = getBtnDelete(isDark);

    // 1. Lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    // 2. Thêm danh mục mới
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name, description });
            alert("Thêm danh mục thành công! 🎉");
            setName('');
            setDescription('');
            fetchCategories(); // Load lại bảng
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi thêm danh mục!");
        }
    };

    // 3. Xóa danh mục
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error: any) {
            alert(error.response?.data?.error || "Không thể xóa danh mục đang chứa chiến dịch!");
        }
    };

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2 style={getH2Style(isDark)}>
                <List size={20} color="#2563eb" /> Quản lý Danh mục
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                
                {/* Cột trái: Form thêm danh mục */}
                <div style={{ backgroundColor: p.surfaceAlt, padding: '20px', borderRadius: '6px', border: `1px solid ${p.border}`, height: 'fit-content' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: p.textSub, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FolderPlus size={16} color="#2563eb" /> Thêm Danh mục mới
                    </h4>
                    <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Tên danh mục *</label>
                            <input 
                                type="text" value={name} onChange={e => setName(e.target.value)} 
                                required placeholder="VD: Bảo vệ môi trường" style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Mô tả ngắn</label>
                            <textarea 
                                value={description} onChange={e => setDescription(e.target.value)} 
                                placeholder="Mô tả về các hoạt động thuộc nhóm này..." rows={3} style={inputStyle} 
                            />
                        </div>
                        <button type="submit" style={btnPrimary}>
                            Tạo Danh mục
                        </button>
                    </form>
                </div>

                {/* Cột phải: Bảng danh sách */}
                <div style={getSectionCard(isDark)}>
                    <div style={getSectionHeader(isDark)}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: p.textSub }}>Danh sách hiện tại</h4>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Tên danh mục</th>
                                <th style={thStyle}>Mô tả</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Số chiến dịch</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.map((cat) => (
                                <tr key={cat.id}>
                                    <td style={{ ...tdStyle, fontWeight: 500, color: p.text }}>{cat.name}</td>
                                    <td style={{ ...tdStyle, color: p.textMuted, fontSize: '12px' }}>{cat.description || '-'}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <span style={{ backgroundColor: isDark ? '#1e3a5f' : '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                            {cat._count?.campaigns || 0}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button onClick={() => handleDelete(cat.id)} style={btnDelete} title="Xóa">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: p.textFaint, fontSize: '13px' }}>Chưa có danh mục nào. Hãy tạo mới bên trái nhé!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {categories.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={categories.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}