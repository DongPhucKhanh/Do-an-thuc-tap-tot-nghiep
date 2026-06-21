import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
    getInputStyle, getLabelStyle, getBtnPrimary,
    getH2Style, palette
} from '../../styles/adminTheme';

export default function CreateCampaign() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

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

    const labelStyle = getLabelStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const btnPrimary = getBtnPrimary(isDark);

    return (
        <div>
            <h2 style={{ ...getH2Style(isDark), display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="#2563eb" /> Tạo Chiến dịch mới
            </h2>

            <div style={{ backgroundColor: p.surface, padding: '24px', borderRadius: '6px', border: `1px solid ${p.border}`, maxWidth: '760px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Hàng 1: Danh mục & Loại quỹ */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Danh mục *</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={inputStyle}>
                                <option value="" disabled>-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Loại hình quỹ *</label>
                            <select value={type} onChange={e => setType(e.target.value)} required style={inputStyle}>
                                <option value="ORGANIZATION">Chiến dịch của Tổ chức</option>
                                <option value="INDIVIDUAL">Quỹ của Cá nhân</option>
                            </select>
                        </div>
                    </div>

                    {/* Hàng 2: Tên & Số lượng */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Tên chiến dịch *</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="VD: Mùa hè xanh 2026" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Số lượng TNV *</label>
                            <input type="number" min="1" value={requiredVolunteers} onChange={e => setRequiredVolunteers(e.target.value)} required placeholder="Ví dụ: 50" style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Mô tả chi tiết *</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} placeholder="Nội dung, mục đích..." style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Địa điểm *</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required placeholder="VD: Quận 1, TP.HCM" style={inputStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Ngày bắt đầu *</label>
                            <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Ngày kết thúc *</label>
                            <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Ảnh bìa (Tùy chọn)</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: '6px 10px' }} />
                    </div>

                    <div style={{ borderTop: `1px solid ${p.border}`, paddingTop: '16px' }}>
                        <button type="submit" style={btnPrimary}>
                            Đăng Chiến Dịch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}