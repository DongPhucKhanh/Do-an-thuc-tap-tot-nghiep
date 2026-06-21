import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Image as ImageIcon, Trash2, Plus, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
    getInputStyle, getLabelStyle, getBtnPrimary, getBtnDelete,
    getFilterPanel, getH2Style, palette
} from '../../styles/adminTheme';

export default function ManageBanners() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [banners, setBanners] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Theme-aware styles inside component
    const labelStyle = getLabelStyle(isDark);
    const inputStyle = getInputStyle(isDark);
    const btnPrimary = getBtnPrimary(isDark);
    const btnDelete = getBtnDelete(isDark);

    // 1. Lấy danh sách banner hiện có
    const fetchBanners = async () => {
        try {
            const res = await api.get('/banners');
            setBanners(res.data.data);
        } catch (err) { console.error("Lỗi tải banner"); }
    };

    useEffect(() => { fetchBanners(); }, []);

    // 2. Xử lý thêm Banner mới
    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Vui lòng chọn ảnh banner!");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('link', link);
        formData.append('image', file);

        try {
            await api.post('/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Thêm banner thành công!");
            setTitle(''); setLink(''); setFile(null);
            fetchBanners(); // Refresh danh sách
        } catch (err) { alert("Lỗi khi thêm banner"); }
    };

    // 3. Xóa Banner
    const handleDelete = async (id: number) => {
        if (!window.confirm("Xóa banner này nhé?")) return;
        try {
            await api.delete(`/banners/${id}`);
            fetchBanners();
        } catch (err) { alert("Lỗi khi xóa"); }
    };

    return (
        <div>
            <h2 style={{ ...getH2Style(isDark), display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="#2563eb" /> Quản lý Banner Trang chủ
            </h2>

            {/* Form Thêm Banner */}
            <div style={{ ...getFilterPanel(isDark), padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: p.textSub, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={15} /> Thêm Banner mới
                </h4>
                <form onSubmit={handleAddBanner} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div>
                        <label style={labelStyle}>Tiêu đề (Tùy chọn)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Chào mừng TNV..." style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Link liên kết (Tùy chọn)</label>
                        <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Chọn ảnh Banner *</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: '5px 8px' }} />
                    </div>
                    <button type="submit" style={{ ...btnPrimary, padding: '9px 16px' }}>
                        Lưu Banner
                    </button>
                </form>
            </div>

            {/* Danh sách Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {banners.map(banner => (
                    <div key={banner.id} style={{ backgroundColor: p.surface, borderRadius: '6px', overflow: 'hidden', border: `1px solid ${p.border}` }}>
                        <img src={`http://localhost:5000${banner.imageUrl}`} alt={banner.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '12px' }}>
                            <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: p.text }}>{banner.title || "Không có tiêu đề"}</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: p.textFaint, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={11} /> {banner.link || "Không có link"}
                                </span>
                                <button onClick={() => handleDelete(banner.id)} style={btnDelete}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: p.textFaint, fontSize: '13px', backgroundColor: p.surface, border: `1px solid ${p.border}`, borderRadius: '6px' }}>
                    Chưa có banner nào. Hãy thêm banner mới ở trên.
                </div>
            )}
        </div>
    );
}