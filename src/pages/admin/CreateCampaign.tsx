import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { PlusCircle } from 'lucide-react';

export default function CreateCampaign() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [requiredVolunteers, setRequiredVolunteers] = useState(''); 
    const [file, setFile] = useState<File | null>(null);
    
    const [categoryId, setCategoryId] = useState(''); 
    // 👇 1. Thêm state để chọn Loại hình (Mặc định là Tổ chức)
    const [type, setType] = useState('ORGANIZATION'); 
    const [categories, setCategories] = useState<any[]>([]); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data);
            } catch (error) { console.error("Lỗi tải danh mục"); }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!categoryId) return alert("Vui lòng chọn danh mục cho chiến dịch!");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('startDate', new Date(startDate).toISOString());
        formData.append('endDate', new Date(endDate).toISOString());
        formData.append('categoryId', categoryId); 
        formData.append('requiredVolunteers', requiredVolunteers); 
        // 👇 2. Gửi loại hình xuống Backend
        formData.append('type', type); 
        
        if (file) formData.append('image', file);

        try {
            await api.post('/campaigns', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Tạo chiến dịch thành công! 🎉");
            navigate('/admin/campaigns');
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi tạo chiến dịch!");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e1e2d', marginBottom: '20px' }}>
                <PlusCircle size={28} color="#3699ff" /> Tạo Chiến dịch mới
            </h2>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* 👇 Hàng 1: Danh mục & Loại quỹ */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Danh mục *</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={inputStyle}>
                                <option value="" disabled>-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Loại hình quỹ *</label>
                            <select value={type} onChange={e => setType(e.target.value)} required style={{...inputStyle, color: type === 'INDIVIDUAL' ? '#e67e22' : '#2980b9', fontWeight: 'bold'}}>
                                <option value="ORGANIZATION">🏢 Chiến dịch của Tổ chức</option>
                                <option value="INDIVIDUAL">👤 Quỹ của Cá nhân</option>
                            </select>
                        </div>
                    </div>

                    {/* Hàng 2: Tên & Số lượng */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Tên chiến dịch *</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="VD: Mùa hè xanh 2026" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Số lượng TNV *</label>
                            <input type="number" min="1" value={requiredVolunteers} onChange={e => setRequiredVolunteers(e.target.value)} required placeholder="Ví dụ: 50" style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Mô tả chi tiết *</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} placeholder="Nội dung, mục đích..." style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Địa điểm *</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required placeholder="VD: Quận 1, TP.HCM" style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ngày bắt đầu *</label>
                            <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ngày kết thúc *</label>
                            <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ảnh bìa (Tùy chọn)</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={inputStyle} />
                    </div>

                    <button type="submit" style={{ padding: '14px', backgroundColor: '#3699ff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
                        🚀 Đăng Chiến Dịch
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', outline: 'none', backgroundColor: '#fdfdfd'
};