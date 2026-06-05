import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Phone, Calendar, MapPin, Users } from 'lucide-react';
import api from '../api/axios';

import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg'; 

export default function Register() {
    // Các state cũ
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [faculties, setFaculties] = useState<any[]>([]);

    // 👇 CÁC STATE MỚI BỔ SUNG
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const res = await api.get('/faculties');
                setFaculties(res.data.data);
            } catch (error) { 
                console.error("Lỗi tải danh sách khoa"); 
            }
        };
        fetchFaculties();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!facultyId) {
            return alert("Vui lòng chọn Khoa của bạn nhé!");
        }
        if (!gender) {
            return alert("Vui lòng chọn Giới tính!");
        }
        if (password !== confirmPassword) {
            return alert("Mật khẩu xác nhận không khớp!");
        }

        try {
            // 👇 CẬP NHẬT PAYLOAD API ĐỂ GỬI THÊM TRƯỜNG MỚI
            await api.post('/auth/register', { 
                fullName, 
                email, 
                password, 
                role: 'VOLUNTEER',
                facultyId,
                phone,
                dob,
                gender,
                address
            });
            
            alert("Đăng ký thành công! Giờ hãy đăng nhập để bắt đầu nhé 🌟");
            navigate('/login');
        } catch (error: any) {
            alert(error.response?.data?.error || "Đăng ký thất bại. Email có thể đã tồn tại!");
        }
    };

    const selectStyle = {
        width: '100%',
        padding: '12px 14px 12px 44px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14.5px',
        fontFamily: 'inherit',
        color: '#0f172a',
        backgroundColor: '#ffffff',
        outline: 'none',
        boxSizing: 'border-box' as const,
        cursor: 'pointer',
        appearance: 'none' as const,
        WebkitAppearance: 'none' as const,
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            padding: '40px 20px',
            backgroundImage: 'radial-gradient(ellipse at 70% 10%, rgba(219,234,254,0.5) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(209,250,229,0.4) 0%, transparent 50%)',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '44px 40px',
                borderRadius: '24px',
                boxShadow: '0 8px 48px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)',
                width: '100%',
                maxWidth: '520px',
                border: '1px solid rgba(226,232,240,0.8)',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '34px' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={logoImg}
                            alt="Logo"
                            style={{
                                height: '68px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))',
                            }}
                        />
                    </div>
                    <h2 style={{
                        margin: '0 0 6px 0',
                        color: '#0f172a',
                        fontSize: '22px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                    }}>
                        Tham gia cộng đồng
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '400' }}>
                        Tạo tài khoản Tình nguyện viên mới
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    {/* Họ và Tên */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label">Họ và Tên</label>
                        <div style={{ position: 'relative' }}>
                            <User size={17} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Dòng 2 cột: Ngày sinh & Giới tính */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                        {/* Ngày sinh */}
                        <div>
                            <label className="form-label">Ngày sinh</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={17} className="input-icon" />
                                <input
                                    type="date"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="form-label">Giới tính</label>
                            <div style={{ position: 'relative' }}>
                                <Users size={17} className="input-icon" />
                                <select
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    style={{ ...selectStyle, color: gender ? '#0f172a' : '#94a3b8' }}
                                >
                                    <option value="" disabled> Chọn Giới tính </option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label">Số điện thoại</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={17} className="input-icon" />
                            <input
                                type="tel"
                                placeholder="09xx xxx xxx"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label">Địa chỉ</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={17} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Số nhà, đường, phường, quận..."
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Khoa trực thuộc */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label">Khoa trực thuộc</label>
                        <div style={{ position: 'relative' }}>
                            <GraduationCap size={17} className="input-icon" />
                            <select
                                required
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                style={{ ...selectStyle, color: facultyId ? '#0f172a' : '#94a3b8' }}
                            >
                                <option value="" disabled>Chọn Khoa của bạn</option>
                                {faculties.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={17} className="input-icon" />
                            <input
                                type="email"
                                placeholder="email@vi-du.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Dòng 2 cột: Mật khẩu & Xác nhận */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                        <div>
                            <label className="form-label">Mật khẩu</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Tối thiểu 6 ký tự"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Xác nhận</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Nhập lại"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        Đăng ký ngay
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: '#64748b' }}>
                    Đã có tài khoản?{' '}
                    <Link
                        to="/login"
                        style={{ color: '#059669', textDecoration: 'none', fontWeight: '600' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}