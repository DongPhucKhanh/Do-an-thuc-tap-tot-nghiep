import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Lock, User, GraduationCap, Phone, Calendar,
    MapPin, Users, Eye, EyeOff, CheckCircle2, Loader2,
    Heart, Star, Globe, Key
} from 'lucide-react';
import api from '../api/axios';
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg';

// ─── Shared input wrapper ──────────────────────────────────────────────────────
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {label}
            </label>
            {children}
        </div>
    );
}

// ─── Text / date / tel / email / password input ────────────────────────────────
function InputWithIcon({
    icon, type = 'text', placeholder, required = false,
    value, onChange, disabled = false,
    rightElement, maxLength
}: {
    icon: React.ReactNode; type?: string; placeholder: string; required?: boolean;
    value: string; onChange: (v: string) => void; disabled?: boolean;
    rightElement?: React.ReactNode; maxLength?: number;
}) {
    return (
        <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                disabled={disabled}
                maxLength={maxLength}
                onChange={e => onChange(e.target.value)}
                className="w-full h-[52px] pl-11 pr-12 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {rightElement && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {rightElement}
                </span>
            )}
        </div>
    );
}

// ─── Select ────────────────────────────────────────────────────────────────────
function SelectWithIcon({
    icon, value, onChange, children, required = false,
}: {
    icon: React.ReactNode; value: string; onChange: (v: string) => void;
    children: React.ReactNode; required?: boolean;
}) {
    return (
        <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200 pointer-events-none z-10">
                {icon}
            </span>
            <select
                required={required}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full h-[52px] pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                style={{ color: value ? '#0f172a' : '#94a3b8' }}
            >
                {children}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </div>
    );
}

// ─── Section divider ───────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
            <div className="flex-1 h-px bg-slate-100" />
        </div>
    );
}

// ─── Stat pill for left panel ──────────────────────────────────────────────────
function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-white font-bold text-sm leading-none">{value}</p>
                <p className="text-emerald-100/80 text-xs mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ─── Component hiển thị Dấu chấm Tiến độ (MỚI THÊM) ───────────────────────────
function StepDot({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
    return (
        <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${done ? 'bg-emerald-500 text-white shadow-md' : active ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md' : 'bg-white text-slate-300 border-2 border-slate-200'}`}>
                {done ? <CheckCircle2 size={16} /> : num}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${active || done ? 'text-emerald-700' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Register() {
    // 🌟 STATE QUẢN LÝ LUỒNG ĐĂNG KÝ
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [otp, setOtp] = useState('');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [faculties, setFaculties] = useState<any[]>([]);

    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // 🌟 BƯỚC 1: GỬI THÔNG TIN ĐĂNG KÝ
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!facultyId) return alert("Vui lòng chọn Khoa của bạn nhé!");
        if (!gender) return alert("Vui lòng chọn Giới tính!");
        if (password !== confirmPassword) return alert("Mật khẩu xác nhận không khớp!");

        setIsLoading(true);
        try {
            await api.post('/auth/register', {
                fullName, email, password, role: 'VOLUNTEER',
                facultyId, phone, dob, gender, address
            });

            // Thay vì nhảy sang trang login, chuyển sang Bước 2 (Nhập OTP)
            setStep(2); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            alert(error.response?.data?.error || "Đăng ký thất bại. Email có thể đã tồn tại!");
        } finally {
            setIsLoading(false);
        }
    };

    // 🌟 BƯỚC 2: XÁC THỰC OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return alert("Vui lòng nhập đủ 6 số OTP!");

        setIsLoading(true);
        try {
            await api.post('/auth/verify-email', { email, otp });
            setStep(3); // Xác thực thành công -> Nhảy sang Bước 3
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            alert(error.response?.data?.error || "Mã OTP không đúng hoặc đã hết hạn!");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    // Tính toán thanh Tiến độ (Progress Bar)
    const progressPct = step === 1 ? '0%' : step === 2 ? '50%' : '100%';

    return (
        <div className="min-h-screen bg-slate-50 flex items-stretch fade-in">

            {/* ─── LEFT PANEL (hidden on mobile) ─────────────────────────────── */}
            <div
                className="hidden lg:flex lg:w-[42%] xl:w-[38%] shrink-0 flex-col justify-between p-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(155deg, #065f46 0%, #059669 45%, #10b981 100%)' }}
            >
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-emerald-900/30" />
                </div>

                {/* Top: logo + system name */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">Hệ thống Quản lý</p>
                            <p className="text-emerald-100/80 text-xs">Tình nguyện viên</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
                        Kết nối sinh viên<br />với cộng đồng
                    </h2>
                    <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xs">
                        Tham gia hàng nghìn bạn sinh viên tích cực, đóng góp cho cộng đồng và tích lũy điểm rèn luyện.
                    </p>
                </div>

                {/* Middle: illustration placeholder */}
                <div className="relative z-10 my-6">
                    <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 flex flex-col gap-3">
                        {[
                            { icon: '🌱', title: 'Mùa hè xanh 2025', sub: 'Bình Dương • 48 tình nguyện viên' },
                            { icon: '📚', title: 'Thư viện lưu động', sub: 'TP.HCM • 23 tình nguyện viên' },
                            { icon: '❤️', title: 'Hiến máu nhân đạo', sub: 'Đồng Nai • 105 tình nguyện viên' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <p className="text-white text-xs font-semibold">{item.title}</p>
                                    <p className="text-emerald-100/70 text-[11px]">{item.sub}</p>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-300 ml-auto shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom: stats */}
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="h-px bg-white/15" />
                    <div className="grid grid-cols-3 gap-3">
                        <StatItem icon={<Users size={16} className="text-white" />} value="5.000+" label="Tình nguyện viên" />
                        <StatItem icon={<Globe size={16} className="text-white" />} value="200+" label="Chiến dịch" />
                        <StatItem icon={<Heart size={16} className="text-white" />} value="50+" label="Đối tác" />
                    </div>
                </div>
            </div>

            {/* ─── RIGHT PANEL: Form ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center items-center px-5 py-10 overflow-y-auto">
                <div className="w-full max-w-[480px]">

                    {/* Mobile logo header */}
                    <div className="flex lg:hidden flex-col items-center gap-2 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
                        </div>
                        <p className="text-slate-400 text-xs font-medium">Hệ thống Quản lý Tình nguyện viên</p>
                    </div>

                    {/* Form header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                            Tạo tài khoản mới
                        </h1>
                        <p className="text-sm text-slate-400">
                            Kết nối sinh viên với các hoạt động cộng đồng ý nghĩa
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">

                        {/* 🌟 THANH TIẾN ĐỘ PROGRESS BAR 🌟 */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between relative px-2">
                                {/* Đường kẻ ngang */}
                                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 -z-0">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-700"
                                        style={{ width: progressPct }}
                                    />
                                </div>
                                <StepDot num={1} label="Điền Form" active={step === 1} done={step > 1} />
                                <StepDot num={2} label="Xác thực OTP" active={step === 2} done={step > 2} />
                                <StepDot num={3} label="Hoàn tất" active={step === 3} done={step === 3} />
                            </div>
                        </div>

                        {/* 🌟 BƯỚC 1: FORM ĐĂNG KÝ 🌟 */}
                        {step === 1 && (
                            <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in zoom-in duration-300" noValidate>
                                <SectionDivider label="Thông tin cá nhân" />
                                <FieldGroup label="Họ và tên *">
                                    <InputWithIcon icon={<User size={16} />} placeholder="Nguyễn Văn A" required value={fullName} onChange={setFullName} />
                                </FieldGroup>

                                <div className="grid grid-cols-2 gap-3">
                                    <FieldGroup label="Ngày sinh *">
                                        <InputWithIcon icon={<Calendar size={16} />} type="date" placeholder="" required value={dob} onChange={setDob} />
                                    </FieldGroup>
                                    <FieldGroup label="Giới tính *">
                                        <SelectWithIcon icon={<Users size={16} />} value={gender} onChange={setGender} required>
                                            <option value="" disabled>Chọn giới tính</option>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </SelectWithIcon>
                                    </FieldGroup>
                                </div>

                                <FieldGroup label="Số điện thoại *">
                                    <InputWithIcon icon={<Phone size={16} />} type="tel" placeholder="09xx xxx xxx" required value={phone} onChange={setPhone} />
                                </FieldGroup>

                                <FieldGroup label="Địa chỉ *">
                                    <InputWithIcon icon={<MapPin size={16} />} placeholder="Số nhà, đường, phường, quận..." required value={address} onChange={setAddress} />
                                </FieldGroup>

                                <SectionDivider label="Thông tin học tập" />
                                <FieldGroup label="Khoa trực thuộc *">
                                    <SelectWithIcon icon={<GraduationCap size={16} />} value={facultyId} onChange={setFacultyId} required>
                                        <option value="" disabled>Chọn Khoa của bạn</option>
                                        {faculties.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </SelectWithIcon>
                                </FieldGroup>

                                <SectionDivider label="Thông tin tài khoản" />
                                <FieldGroup label="Địa chỉ Email *">
                                    <InputWithIcon icon={<Mail size={16} />} type="email" placeholder="email@truong.edu.vn" required value={email} onChange={setEmail} />
                                </FieldGroup>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldGroup label="Mật khẩu *">
                                        <InputWithIcon
                                            icon={<Lock size={16} />} type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" required value={password} onChange={setPassword}
                                            rightElement={
                                                <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            }
                                        />
                                    </FieldGroup>
                                    <FieldGroup label="Xác nhận *">
                                        <div className="relative">
                                            <InputWithIcon
                                                icon={<Lock size={16} />} type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" required value={confirmPassword} onChange={setConfirmPassword}
                                                rightElement={
                                                    confirmPassword.length > 0 ? (
                                                        passwordsMatch ? <CheckCircle2 size={15} className="text-emerald-500" /> : (
                                                            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                                            </button>
                                                        )
                                                    ) : undefined
                                                }
                                            />
                                            {passwordMismatch && (
                                                <p className="absolute -bottom-5 left-0 text-[11px] text-red-500 font-medium">Mật khẩu chưa khớp</p>
                                            )}
                                        </div>
                                    </FieldGroup>
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-300 mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{
                                        background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                        boxShadow: isLoading ? 'none' : '0 6px 20px rgba(5,150,105,0.30)',
                                    }}
                                >
                                    {isLoading ? (
                                        <><Loader2 size={17} className="animate-spin" /> Đang đăng ký...</>
                                    ) : (
                                        <><CheckCircle2 size={17} /> Đăng ký ngay</>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* 🌟 BƯỚC 2: MÀN HÌNH NHẬP OTP 🌟 */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100">
                                        <Mail size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Kiểm tra hộp thư của bạn</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed px-4">
                                        Mã xác thực 6 số đã được gửi tới địa chỉ <br/>
                                        <b className="text-slate-800">{email}</b>
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center block">Nhập mã OTP</label>
                                    <input 
                                        type="text" 
                                        required 
                                        maxLength={6}
                                        placeholder="••••••" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-3xl tracking-[0.7em] text-center font-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                    />
                                </div>

                                <button
                                    type="submit" disabled={isLoading || otp.length < 6}
                                    className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/30"
                                >
                                    {isLoading ? <Loader2 size={17} className="animate-spin" /> : 'Xác thực & Hoàn tất'}
                                </button>
                            </form>
                        )}

                        {/* 🌟 BƯỚC 3: THÀNH CÔNG 🌟 */}
                        {step === 3 && (
                            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
                                    <CheckCircle2 size={40} className="animate-bounce" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">Thành công rực rỡ!</h3>
                                <p className="text-sm text-slate-500 mb-8 px-4 font-medium leading-relaxed">
                                    Tài khoản của bạn đã được xác minh an toàn. Bây giờ bạn có thể đăng nhập để tham gia các chiến dịch tình nguyện.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex w-full h-[52px] items-center justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Về trang Đăng nhập
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Footer login link (Ẩn đi nếu đang ở bước 2 hoặc 3) */}
                    {step === 1 && (
                        <div className="mt-5 bg-white border border-slate-100 rounded-2xl px-6 py-4 text-center shadow-sm">
                            <p className="text-sm text-slate-500">
                                Đã có tài khoản?{' '}
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
                        © 2026 Cao đẳng Công Thương TP.HCM · Hệ thống Quản lý Tình nguyện viên
                    </p>
                </div>
            </div>
        </div>
    );
}