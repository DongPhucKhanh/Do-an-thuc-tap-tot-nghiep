import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { FolderPlus, Trash2, List } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function ManageCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e1e2d', marginBottom: '20px' }}>
                <List size={28} color="#3699ff" /> Quản lý Danh mục
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                
                {/* Cột trái: Form thêm danh mục */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FolderPlus size={20} color="#00b894" /> Thêm Danh mục mới
                    </h4>
                    <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Tên danh mục *</label>
                            <input 
                                type="text" value={name} onChange={e => setName(e.target.value)} 
                                required placeholder="VD: Bảo vệ môi trường" style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Mô tả ngắn</label>
                            <textarea 
                                value={description} onChange={e => setDescription(e.target.value)} 
                                placeholder="Mô tả về các hoạt động thuộc nhóm này..." rows={3} style={inputStyle} 
                            />
                        </div>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Tạo Danh mục
                        </button>
                    </form>
                </div>

                {/* Cột phải: Bảng danh sách */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginBottom: '20px' }}>Danh sách hiện tại</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f2f6', color: '#636e72' }}>
                                <th style={{ padding: '12px 10px' }}>Tên danh mục</th>
                                <th style={{ padding: '12px 10px' }}>Mô tả</th>
                                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Số chiến dịch</th>
                                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.map((cat, index) => (
                                <tr key={cat.id} style={{ borderBottom: '1px solid #f1f2f6', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: '500', color: '#2d3436' }}>{cat.name}</td>
                                    <td style={{ padding: '12px 10px', color: '#636e72', fontSize: '14px' }}>{cat.description || '-'}</td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                        <span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                            {cat._count?.campaigns || 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                        <button onClick={() => handleDelete(cat.id)} style={{ border: 'none', background: '#fff1f1', color: '#f64e60', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#b2bec3' }}>Chưa có danh mục nào. Hãy tạo mới bên trái nhé!</td>
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

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dfe6e9', marginTop: '5px', outline: 'none'
};