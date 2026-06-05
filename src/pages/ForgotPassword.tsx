import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Key, ArrowLeft, CheckCircle2, Lock, Loader2,
    ShieldCheck, Eye, EyeOff, AlertCircle,
    Users, Globe, Heart,
} from 'lucide-react';
import api from '../api/axios';
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Left-panel benefit row */
function BenefitRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-400/30 border border-emerald-300/40 flex items-center justify-center shrink-0">
                <CheckCircle2 size={11} className="text-emerald-300" />
            </div>
            <span className="text-emerald-100/85 text-sm">{text}</span>
        </div>
    );
}

/** Left-panel stat pill */
function StatPill({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                {icon}
            </div>
            <div>
                <p className="text-white font-extrabold text-sm leading-none">{value}</p>
                <p className="text-emerald-100/70 text-[11px] mt-0.5">{label}</p>
            </div>
        </div>
    );
}

/** Step indicator dot */
function StepDot({
    num, label, active, done,
}: { num: number; label: string; active: boolean; done: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div
                className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2',
                    done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : active
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400',
                ].join(' ')}
            >
                {done ? <CheckCircle2 size={16} /> : num}
            </div>
            <span
                className={[
                    'text-[11px] font-semibold whitespace-nowrap transition-colors duration-300',
                    active ? 'text-emerald-600' : done ? 'text-emerald-500' : 'text-slate-400',
                ].join(' ')}
            >
                {label}
            </span>
        </div>
    );
}

/** Inline error alert */
function ErrorAlert({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span>{message}</span>
        </div>
    );
}

/** Password strength meter (UI-only, does not affect logic) */
function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);

    const levels = [
        { label: 'Yếu', color: 'bg-red-400', textColor: 'text-red-500' },
        { label: 'Trung bình', color: 'bg-amber-400', textColor: 'text-amber-500' },
        { label: 'Trung bình', color: 'bg-amber-400', textColor: 'text-amber-500' },
        { label: 'Mạnh', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
        { label: 'Rất mạnh', color: 'bg-emerald-600', textColor: 'text-emerald-700' },
    ];
    const level = levels[Math.min(score, 4)];

    return (
        <div className="space-y-1.5 mt-2">
            <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={[
                            'h-1.5 flex-1 rounded-full transition-all duration-300',
                            i < score ? level.color : 'bg-slate-200',
                        ].join(' ')}
                    />
                ))}
            </div>
            <p className={`text-[11px] font-semibold ${level.textColor}`}>
                Độ mạnh: {level.label}
            </p>
        </div>
    );
}

/** 6-box OTP input — assembles into the `otp` state string */
function OtpBoxes({
    value, onChange,
}: { value: string; onChange: (v: string) => void }) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const handleKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !refs.current[index]?.value && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handleChange = (index: number, char: string) => {
        const digit = char.replace(/[^0-9]/g, '').slice(-1);
        const arr = value.split('');
        arr[index] = digit;
        const next = arr.join('').padEnd(6, '').slice(0, 6);
        onChange(next.trimEnd()); // keep trailing empty as ''
        // Build clean value
        const filled = value.split('');
        filled[index] = digit;
        const clean = filled.map((c, i) => (i <= index ? c || '' : c || '')).join('');
        onChange(clean.slice(0, 6));
        if (digit && index < 5) refs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        onChange(pasted.padEnd(6, '').slice(0, 6));
        refs.current[Math.min(pasted.length, 5)]?.focus();
        e.preventDefault();
    };

    return (
        <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    onFocus={e => e.target.select()}
                    className="w-11 h-14 text-center text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white caret-emerald-500"
                    aria-label={`OTP chữ số ${i + 1}`}
                />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
    const navigate = useNavigate();

    // Quản lý các bước: 1 - Nhập Email, 2 - Nhập OTP & Pass mới, 3 - Xong
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // UI-only state (does not touch any logic)
    const [showPassword, setShowPassword] = useState(false);

    // Auto-focus first OTP box when entering step 2
    const firstOtpRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (step === 2) {
            setTimeout(() => firstOtpRef.current?.focus(), 100);
        }
    }, [step]);

    // BƯỚC 1: Bắn API gửi OTP về mail
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Nhớ check lại xem route mày nối ở index.ts là /api/users hay /api/auth nhé
            await api.post('/users/request-password-reset', { email });
            setStep(2); // Thành công thì chuyển sang bước nhập OTP
        } catch (err: any) {
            setError(err.response?.data?.error || 'Lỗi hệ thống. Không thể gửi email!');
        } finally {
            setIsLoading(false);
        }
    };

    // BƯỚC 2: Bắn API xác nhận OTP và đổi Pass
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/users/reset-password', { email, otp, newPassword });
            setStep(3); // Thành công thì chuyển sang màn hình xanh lá
        } catch (err: any) {
            setError(err.response?.data?.error || 'Mã OTP không đúng hoặc đã hết hạn!');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Step progress bar width ──
    const progressPct = step === 1 ? '0%' : step === 2 ? '50%' : '100%';

    return (
        <div className="min-h-screen bg-slate-50 flex items-stretch fade-in">

            {/* ══════════════════════════════════════════════════════════════
                LEFT PANEL — hidden on mobile
            ══════════════════════════════════════════════════════════════ */}
            <div
                className="hidden lg:flex lg:w-[42%] xl:w-[40%] shrink-0 flex-col justify-between p-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(155deg, #064e3b 0%, #059669 50%, #0ea5e9 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute top-[40%] -left-20 w-56 h-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-24 right-8 w-72 h-72 rounded-full bg-teal-900/30" />
                </div>

                {/* Top: brand */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
                            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">Hệ thống Quản lý</p>
                            <p className="text-emerald-100/75 text-xs">Tình nguyện viên · CĐCT TP.HCM</p>
                        </div>
                    </div>

                    <div className="mb-10">
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
                            🔐 Bảo mật tài khoản
                        </p>
                        <h2
                            className="text-white font-extrabold leading-tight mb-3"
                            style={{ fontSize: 'clamp(22px, 2.8vw, 30px)' }}
                        >
                            Khôi phục<br />tài khoản
                        </h2>
                        <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xs">
                            Lấy lại quyền truy cập tài khoản tình nguyện viên một cách an toàn và nhanh chóng.
                        </p>
                    </div>

                    {/* Security illustration */}
                    <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                                <ShieldCheck size={20} className="text-emerald-300" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Xác thực bảo mật</p>
                                <p className="text-emerald-200/70 text-xs">3 bước an toàn</p>
                            </div>
                        </div>

                        {/* Fake progress steps in panel */}
                        <div className="space-y-2.5">
                            {[
                                { done: step > 1, active: step === 1, label: 'Xác minh địa chỉ email' },
                                { done: step > 2, active: step === 2, label: 'Nhập mã OTP bảo mật' },
                                { done: step === 3, active: step === 3, label: 'Cập nhật mật khẩu mới' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={[
                                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300',
                                        s.done ? 'bg-emerald-400 border-emerald-400' : s.active ? 'border-white/60 bg-white/10' : 'border-white/20 bg-transparent',
                                    ].join(' ')}>
                                        {s.done && <CheckCircle2 size={11} className="text-white" />}
                                    </div>
                                    <span className={`text-sm transition-colors duration-300 ${s.done || s.active ? 'text-white font-medium' : 'text-emerald-100/50'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        <BenefitRow text="Bảo mật OTP qua Email" />
                        <BenefitRow text="Xác thực 2 bước an toàn" />
                        <BenefitRow text="Mật khẩu được mã hóa AES-256" />
                        <BenefitRow text="Khôi phục nhanh chóng trong 5 phút" />
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10">
                    <div className="h-px bg-white/15 mb-5" />
                    <div className="grid grid-cols-3 gap-2">
                        <StatPill value="5.000+" label="Tình nguyện viên" icon={<Users size={14} />} />
                        <StatPill value="200+" label="Chiến dịch" icon={<Globe size={14} />} />
                        <StatPill value="50+" label="Đối tác" icon={<Heart size={14} />} />
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                RIGHT PANEL — Form
            ══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col justify-center items-center px-5 py-12 overflow-y-auto">
                <div className="w-full max-w-[440px]">

                    {/* Mobile logo */}
                    <div className="flex lg:hidden flex-col items-center gap-2 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium text-center">
                            Hệ thống Quản lý Tình nguyện viên
                        </p>
                    </div>

                    {/* Back button — hidden on step 3 */}
                    {step !== 3 && (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200 mb-6"
                        >
                            <ArrowLeft size={15} />
                            Quay lại đăng nhập
                        </button>
                    )}

                    {/* ── STEP INDICATOR ── */}
                    {step !== 3 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between relative">
                                {/* Progress line */}
                                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: progressPct }}
                                    />
                                </div>
                                <StepDot num={1} label="Email" active={step === 1} done={step > 1} />
                                <StepDot num={2} label="Xác thực OTP" active={step === 2} done={step > 2} />
                                <StepDot num={3} label="Hoàn tất" active={step === 3} done={step === 3} />
                            </div>
                        </div>
                    )}

                    {/* ── MAIN CARD ── */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* ════════════ STEP 1: EMAIL ════════════ */}
                        {step === 1 && (
                            <div className="p-7 fade-in">
                                {/* Icon header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                        <Mail size={26} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                            Quên mật khẩu?
                                        </h1>
                                        <p className="text-sm text-slate-400 mt-0.5">
                                            Chúng tôi sẽ gửi mã OTP qua email
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                    Nhập địa chỉ email bạn đã dùng để đăng ký. Hệ thống sẽ gửi một mã OTP gồm 6 chữ số để khôi phục tài khoản.
                                </p>

                                <ErrorAlert message={error} />

                                <form onSubmit={handleRequestOtp} className="space-y-5 mt-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="fp-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                            Địa chỉ Email
                                        </label>
                                        <div className="relative group">
                                            <Mail
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none"
                                            />
                                            <input
                                                id="fp-email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                placeholder="email@truong.edu.vn"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full h-[52px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{
                                            background: isLoading
                                                ? '#94a3b8'
                                                : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                            boxShadow: isLoading ? 'none' : '0 6px 20px rgba(5,150,105,0.28)',
                                        }}
                                        onMouseEnter={e => {
                                            if (!isLoading) {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.transform = 'translateY(-2px)';
                                                el.style.boxShadow = '0 10px 28px rgba(5,150,105,0.36)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLButtonElement;
                                            el.style.transform = 'translateY(0)';
                                            el.style.boxShadow = isLoading ? 'none' : '0 6px 20px rgba(5,150,105,0.28)';
                                        }}
                                    >
                                        {isLoading ? (
                                            <><Loader2 size={17} className="animate-spin" /> Đang gửi mã...</>
                                        ) : (
                                            <><Mail size={16} /> Gửi mã OTP</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ════════════ STEP 2: OTP + NEW PASSWORD ════════════ */}
                        {step === 2 && (
                            <div className="p-7 fade-in">
                                {/* Icon header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                        <Key size={26} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                            Xác thực tài khoản
                                        </h1>
                                        <p className="text-sm text-slate-400 mt-0.5">
                                            Mã OTP có hiệu lực trong 5 phút
                                        </p>
                                    </div>
                                </div>

                                {/* Email hint */}
                                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6">
                                    <Mail size={14} className="text-blue-500 shrink-0" />
                                    <p className="text-sm text-blue-700">
                                        Mã OTP đã gửi tới{' '}
                                        <span className="font-bold">{email}</span>
                                    </p>
                                </div>

                                <ErrorAlert message={error} />

                                <form onSubmit={handleResetPassword} className="space-y-6 mt-4">
                                    {/* 6-box OTP */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
                                            Mã OTP (6 chữ số)
                                        </label>
                                        <OtpBoxes value={otp} onChange={setOtp} />
                                        <p className="text-[11px] text-slate-400 text-center">
                                            Bạn có thể dán (Ctrl+V) toàn bộ mã vào ô đầu tiên
                                        </p>
                                    </div>

                                    {/* New password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="fp-newpw" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative group">
                                            <Lock
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none"
                                            />
                                            <input
                                                id="fp-newpw"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                placeholder="Tối thiểu 6 ký tự"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
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
                                        <PasswordStrength password={newPassword} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length < 6}
                                        className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{
                                            background: (isLoading || otp.length < 6)
                                                ? '#94a3b8'
                                                : 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                                            boxShadow: (isLoading || otp.length < 6) ? 'none' : '0 6px 20px rgba(37,99,235,0.25)',
                                        }}
                                        onMouseEnter={e => {
                                            if (!isLoading && otp.length >= 6) {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.transform = 'translateY(-2px)';
                                                el.style.boxShadow = '0 10px 28px rgba(37,99,235,0.32)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLButtonElement;
                                            el.style.transform = 'translateY(0)';
                                            el.style.boxShadow = (isLoading || otp.length < 6) ? 'none' : '0 6px 20px rgba(37,99,235,0.25)';
                                        }}
                                    >
                                        {isLoading ? (
                                            <><Loader2 size={17} className="animate-spin" /> Đang xác thực...</>
                                        ) : (
                                            <><ShieldCheck size={16} /> Đặt lại mật khẩu</>
                                        )}
                                    </button>

                                    {/* Resend hint */}
                                    <p className="text-center text-xs text-slate-400">
                                        Không nhận được mã?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                            className="text-emerald-600 font-semibold hover:underline transition-colors"
                                        >
                                            Gửi lại
                                        </button>
                                    </p>
                                </form>
                            </div>
                        )}

                        {/* ════════════ STEP 3: SUCCESS ════════════ */}
                        {step === 3 && (
                            <div className="p-10 text-center fade-in">
                                {/* Success icon */}
                                <div className="relative mx-auto mb-6 w-24 h-24">
                                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
                                    <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                                        <CheckCircle2 size={48} className="text-emerald-500" />
                                    </div>
                                </div>

                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Khôi phục thành công!
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xs mx-auto">
                                    Mật khẩu của bạn đã được cập nhật an toàn. Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới.
                                </p>

                                {/* Summary card */}
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-left space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-medium">Email tài khoản</span>
                                        <span className="text-xs text-slate-700 font-semibold">{email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-medium">Trạng thái</span>
                                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                            <CheckCircle2 size={11} /> Đã cập nhật
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to="/login"
                                    className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                        boxShadow: '0 6px 20px rgba(5,150,105,0.28)',
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.transform = 'translateY(-2px)';
                                        el.style.boxShadow = '0 10px 28px rgba(5,150,105,0.36)';
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.transform = 'translateY(0)';
                                        el.style.boxShadow = '0 6px 20px rgba(5,150,105,0.28)';
                                    }}
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Footer link */}
                    {step !== 3 && (
                        <div className="mt-4 bg-white border border-slate-100 rounded-2xl px-6 py-4 text-center shadow-sm">
                            <p className="text-sm text-slate-500">
                                Nhớ ra mật khẩu rồi?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    )}

                    <p className="text-center text-xs text-slate-400 mt-5">
                        © 2025 Cao đẳng Công Thương TP.HCM · Hệ thống Quản lý Tình nguyện viên
                    </p>
                </div>
            </div>
        </div>
    );
}