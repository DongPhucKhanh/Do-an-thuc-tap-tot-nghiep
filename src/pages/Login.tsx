import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Users, Globe, Heart, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg';

// ─── Left panel stat item ──────────────────────────────────────────────────────
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                {icon}
            </div>
            <div>
                <p className="text-white font-extrabold text-base leading-none">{value}</p>
                <p className="text-emerald-100/75 text-xs mt-0.5 leading-tight">{label}</p>
            </div>
        </div>
    );
}

// ─── Activity preview card ─────────────────────────────────────────────────────
function ActivityRow({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
    return (
        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
            <span className="text-lg">{emoji}</span>
            <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{title}</p>
                <p className="text-emerald-100/70 text-[11px] truncate">{sub}</p>
            </div>
            <ShieldCheck size={13} className="text-emerald-300 ml-auto shrink-0" />
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // UI-only state (does not affect any logic)
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert("Chào mừng bạn quay trở lại! 🎉");
            navigate('/');
            window.location.reload();
        } catch (error: any) {
            alert(error.response?.data?.error || "Đăng nhập thất bại, kiểm tra lại email/mật khẩu nhé!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-stretch fade-in">

            {/* ════════════════════════════════════════════════════════════════
                LEFT PANEL — hidden on mobile
            ════════════════════════════════════════════════════════════════ */}
            <div
                className="hidden lg:flex lg:w-[42%] xl:w-[40%] shrink-0 flex-col justify-between p-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(155deg, #064e3b 0%, #059669 50%, #10b981 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute top-[38%] -left-20 w-60 h-60 rounded-full bg-white/5" />
                    <div className="absolute -bottom-24 right-8 w-72 h-72 rounded-full bg-emerald-900/30" />
                </div>

                {/* ── Top: brand ── */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
                            <img src={logoImg} alt="Logo Đoàn Thanh Niên" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">Hệ thống Quản lý</p>
                            <p className="text-emerald-100/75 text-xs">Tình nguyện viên · CĐCT TP.HCM</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
                            👋 Chào mừng trở lại
                        </p>
                        <h2 className="text-white font-extrabold leading-tight mb-3"
                            style={{ fontSize: 'clamp(22px,2.8vw,32px)' }}>
                            Kết nối sinh viên<br />với cộng đồng
                        </h2>
                        <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xs">
                            Tham gia hàng nghìn bạn sinh viên tích cực, đóng góp cho cộng đồng và tích lũy điểm rèn luyện.
                        </p>
                    </div>

                    {/* Activity preview */}
                    <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm p-4 space-y-2">
                        <p className="text-emerald-200/70 text-[11px] font-semibold uppercase tracking-wider mb-3 px-1">
                            Chiến dịch đang diễn ra
                        </p>
                        <ActivityRow emoji="🌱" title="Mùa hè xanh 2025" sub="Bình Dương · 48 tình nguyện viên" />
                        <ActivityRow emoji="📚" title="Thư viện lưu động" sub="TP.HCM · 23 tình nguyện viên" />
                        <ActivityRow emoji="❤️" title="Hiến máu nhân đạo" sub="Đồng Nai · 105 tình nguyện viên" />
                    </div>
                </div>

                {/* ── Bottom: stats ── */}
                <div className="relative z-10">
                    <div className="h-px bg-white/15 mb-5" />
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard value="5.000+" label="Tình nguyện viên" icon={<Users size={16} />} />
                        <StatCard value="200+" label="Chiến dịch" icon={<Globe size={16} />} />
                        <StatCard value="50+" label="Đối tác" icon={<Heart size={16} />} />
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                RIGHT PANEL — Login form
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col justify-center items-center px-5 py-12 overflow-y-auto">
                <div className="w-full max-w-[420px]">

                    {/* Mobile brand header */}
                    <div className="flex lg:hidden flex-col items-center gap-2 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium text-center">
                            Hệ thống Quản lý Tình nguyện viên
                        </p>
                    </div>

                    {/* Form header */}
                    <div className="mb-8">
                        <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2">
                            👋 Chào mừng trở lại
                        </p>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Đăng nhập hệ thống
                        </h1>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Đăng nhập để tham gia các hoạt động tình nguyện và theo dõi hành trình cống hiến của bạn.
                        </p>
                    </div>

                    {/* ── Form card ── */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 space-y-5">
                        <form onSubmit={handleLogin} className="space-y-5" noValidate>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="login-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Địa chỉ Email
                                </label>
                                <div className="relative group">
                                    <Mail
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none"
                                    />
                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="email@truong.edu.vn"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full h-[52px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="login-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Mật khẩu
                                </label>
                                <div className="relative group">
                                    <Lock
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none"
                                    />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full h-[52px] pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me + Forgot password */}
                            <div className="flex items-center justify-between pt-0.5">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                                    />
                                    <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors duration-200">
                                        Ghi nhớ đăng nhập
                                    </span>
                                </label>
                                
                                {/* 🌟 ĐÃ SỬA CHỖ NÀY THÀNH THẺ LINK ĐỂ CHUYỂN TRANG */}
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: isLoading
                                        ? '#94a3b8'
                                        : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                    boxShadow: isLoading ? 'none' : '0 6px 20px rgba(5,150,105,0.30)',
                                }}
                                onMouseEnter={e => {
                                    if (!isLoading) {
                                        const el = e.currentTarget as HTMLButtonElement;
                                        el.style.transform = 'translateY(-2px) scale(1.02)';
                                        el.style.boxShadow = '0 10px 28px rgba(5,150,105,0.38)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.transform = 'translateY(0) scale(1)';
                                    el.style.boxShadow = isLoading ? 'none' : '0 6px 20px rgba(5,150,105,0.30)';
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={17} className="animate-spin" />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    <>
                                        Đăng nhập
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ── Social login (UI only) ── */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Google */}
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2.5 h-[46px] bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all duration-200"
                            >
                                {/* Google colour "G" icon */}
                                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>

                            {/* Facebook */}
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2.5 h-[46px] bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all duration-200"
                            >
                                {/* Facebook "f" icon */}
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    {/* ── Footer card ── */}
                    <div className="mt-4 bg-white border border-slate-100 rounded-2xl px-6 py-4 text-center shadow-sm">
                        <p className="text-sm text-slate-500">
                            Chưa có tài khoản?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-5">
                        © 2025 Cao đẳng Công Thương TP.HCM · Hệ thống Quản lý Tình nguyện viên
                    </p>
                </div>
            </div>
        </div>
    );
}