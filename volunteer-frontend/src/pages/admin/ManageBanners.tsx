import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Image as ImageIcon, Trash2, Plus, Globe } from 'lucide-react';

export default function ManageBanners() {
    const [banners, setBanners] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState<File | null>(null);

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
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e1e2d' }}>
                <ImageIcon size={28} color="#3699ff" /> Quản lý Banner Trang chủ
            </h2>

            {/* Form Thêm Banner */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', marginBottom: '30px', marginTop: '20px' }}>
                <h4 style={{ marginBottom: '20px', color: '#3f4254' }}>✨ Thêm Banner mới</h4>
                <form onSubmit={handleAddBanner} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Tiêu đề (Tùy chọn)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Chào mừng TNV..." style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Link liên kết (Tùy chọn)</label>
                        <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Chọn ảnh Banner</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={inputStyle} />
                    </div>
                    <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#1bc5bd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        <Plus size={18} /> Lưu Banner
                    </button>
                </form>
            </div>

            {/* Danh sách Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {banners.map(banner => (
                    <div key={banner.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <img src={`http://localhost:5000${banner.imageUrl}`} alt={banner.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        <div style={{ padding: '15px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>{banner.title || "Không có tiêu đề"}</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#b5b5c3' }}>
                                    <Globe size={12} /> {banner.link || "Không có link"}
                                </span>
                                <button onClick={() => handleDelete(banner.id)} style={{ border: 'none', background: '#fff1f1', color: '#f64e60', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', marginTop: '5px', outline: 'none'
};