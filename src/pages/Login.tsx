import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react'; // Bỏ LogIn icon nếu không dùng nữa
import api from '../api/axios';

// 1. Import logo của bạn vào đây (đảm bảo đúng tên file trong src/assets)
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert("Chào mừng bạn quay trở lại! 🎉");
            navigate('/');
            window.location.reload();
        } catch (error: any) {
            alert(error.response?.data?.error || "Đăng nhập thất bại, kiểm tra lại email/mật khẩu nhé!");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '90vh',
            backgroundColor: '#f8fafc',
            padding: '24px 20px',
            backgroundImage: 'radial-gradient(ellipse at 60% 20%, rgba(219,234,254,0.5) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(209,250,229,0.4) 0%, transparent 50%)',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '44px 40px',
                borderRadius: '24px',
                boxShadow: '0 8px 48px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid rgba(226,232,240,0.8)',
            }}>
                {/* Logo & Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <img
                            src={logoImg}
                            alt="Logo"
                            style={{
                                height: '72px',
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
                        Đăng nhập
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '400' }}>
                        Dành cho Tình nguyện viên
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <div style={{ marginBottom: '18px' }}>
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

                    {/* Mật khẩu */}
                    <div style={{ marginBottom: '28px' }}>
                        <label className="form-label">Mật khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        Bắt đầu ngay
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: '#64748b' }}>
                    Chưa có tài khoản?{' '}
                    <Link
                        to="/register"
                        style={{ color: '#059669', textDecoration: 'none', fontWeight: '600' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}