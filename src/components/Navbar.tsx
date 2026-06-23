import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown, ClipboardList, LogOut, Shield, User,
  PlusCircle, Menu, X, HeartHandshake, Trophy, ImageIcon,
  Newspaper, BookOpen, FileText, LayoutGrid, MapPin, Sun, Moon, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';

// ─── Kiểu dữ liệu menu ─────────────────────────────
interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  desc?: string;
}
interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// ─── Menu data với icon và mô tả ───────────────────
const menuData: Record<string, MenuGroup> = {
  khampha: {
    title: 'Khám phá',
    items: [
      { label: 'Bảng xếp hạng thi đua', path: '/leaderboard', icon: <Trophy size={16} />, desc: 'Top tình nguyện viên xuất sắc' },
      { label: 'Khoảnh khắc tình nguyện', path: '/gallery', icon: <ImageIcon size={16} />, desc: 'Thư viện ảnh hoạt động' },
      { label: 'Cẩm nang tình nguyện', path: '/handbook', icon: <BookOpen size={16} />, desc: 'Hướng dẫn kỹ năng' }
    ]
  },
  gioithieu: {
    title: 'Thông tin',
    items: [
      { label: 'Tin tức & Câu chuyện', path: '/news', icon: <Newspaper size={16} />, desc: 'Cập nhật mới nhất' },
      { label: 'Quy chế điểm rèn luyện', path: '/training-regulations', icon: <FileText size={16} />, desc: 'Quy định tích lũy điểm' },
      { label: 'Cẩm nang hướng dẫn', path: '/handbook', icon: <BookOpen size={16} />, desc: 'Tài liệu hướng dẫn tình nguyện' },
    ]
  }
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Scroll detection ──────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close mobile on route change ──────────────────
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // ── Prevent body scroll when mobile open ──────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR CHÍNH
      ══════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 w-full transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' 
            ? (scrolled ? 'rgba(15,23,42,0.96)' : 'rgba(15,23,42,0.88)') 
            : (scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.88)'),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: theme === 'dark'
            ? (scrolled ? '1px solid rgba(51,65,85,0.9)' : '1px solid rgba(51,65,85,0.5)')
            : (scrolled ? '1px solid rgba(226,232,240,0.9)' : '1px solid rgba(226,232,240,0.5)'),
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.08)' : '0 1px 12px rgba(0,0,0,0.04)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          height: 'var(--nav-height)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-6">

          {/* ── LOGO ─────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1.5px solid rgba(37,99,235,0.15)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.12)',
              flexShrink: 0,
            }}>
              <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="flex flex-col leading-none">
              <span style={{ fontWeight: 800, fontSize: '15px', color: theme === 'dark' ? '#f8fafc' : '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                ThienNguyen
              </span>
              <span style={{ fontSize: '10px', color: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 500, letterSpacing: '0.02em' }}>
                Nền tảng tình nguyện
              </span>
            </div>
          </Link>

          {/* ── MENU DESKTOP ─────────────────────── */}
          <div className="hidden md:flex items-center gap-1">

            <Link
              to="/"
              className="nav-link px-3 py-2 rounded-lg transition-colors text-sm"
              style={{
                color: isActive('/') ? '#2563eb' : '#475569',
                backgroundColor: isActive('/') ? '#eff6ff' : 'transparent',
                fontWeight: isActive('/') ? 600 : 500,
              }}
            >
              Trang chủ
            </Link>

            <Link
              to="/campaigns"
              className="nav-link px-3 py-2 rounded-lg transition-colors text-sm"
              style={{
                color: isActive('/campaigns') ? '#2563eb' : theme === 'dark' ? '#cbd5e1' : '#475569',
                backgroundColor: isActive('/campaigns') ? (theme === 'dark' ? '#1e3a8a' : '#eff6ff') : 'transparent',
                fontWeight: isActive('/campaigns') ? 600 : 500,
              }}
            >
              Chiến dịch
            </Link>

            <Link
              to="/contact"
              className="nav-link px-3 py-2 rounded-lg transition-colors text-sm"
              style={{
                color: isActive('/contact') ? '#2563eb' : theme === 'dark' ? '#cbd5e1' : '#475569',
                backgroundColor: isActive('/contact') ? (theme === 'dark' ? '#1e3a8a' : '#eff6ff') : 'transparent',
                fontWeight: isActive('/contact') ? 600 : 500,
              }}
            >
              Liên hệ
            </Link>

            {/* Dropdown menus */}
            {Object.keys(menuData).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: activeDropdown === key ? '#2563eb' : '#475569',
                    backgroundColor: activeDropdown === key ? '#eff6ff' : 'transparent',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {menuData[key].title}
                  <motion.span
                    animate={{ rotate: activeDropdown === key ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        minWidth: '260px',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(226,232,240,0.8)',
                        padding: '6px',
                        zIndex: 100,
                      }}
                      onMouseEnter={() => handleDropdownEnter(key)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {/* Arrow */}
                      <div style={{
                        position: 'absolute', top: '-5px', left: '50%',
                        width: '10px', height: '10px',
                        backgroundColor: '#fff',
                        border: '1px solid rgba(226,232,240,0.8)',
                        borderRadius: '2px',
                        transform: 'translateX(-50%) rotate(45deg)',
                        borderRight: 'none', borderBottom: 'none',
                      }} />

                      {menuData[key].items.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => { setActiveDropdown(null); navigate(item.path); }}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
                          style={{ textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            backgroundColor: '#eff6ff', color: '#2563eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: '1px',
                            transition: 'background-color 0.2s',
                          }}>
                            {item.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                              {item.label}
                            </div>
                            {item.desc && (
                              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>
                                {item.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── USER SECTION DESKTOP ─────────────── */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {token ? (
              <>
                {/* Đề xuất hoạt động */}
                <button
                  onClick={() => navigate('/admin/create-campaign')}
                  className="btn btn-sm flex items-center gap-1.5"
                  style={{
                    backgroundColor: '#e11d48',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
                    border: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#be123c';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#e11d48';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <PlusCircle size={14} />
                  Đề xuất
                </button>

                {/* Việc của tôi */}
                {(user.role === 'VOLUNTEER' || user.role === 'USER') && (
                  <Link
                    to="/my-activities"
                    className="btn btn-outline btn-sm flex items-center gap-1.5"
                    style={{ textDecoration: 'none' }}
                  >
                    <ClipboardList size={14} />
                    Việc của tôi
                  </Link>
                )}

                {/* Admin */}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="btn btn-outline btn-sm flex items-center gap-1.5"
                    style={{ textDecoration: 'none', color: '#2563eb', borderColor: '#dbeafe', backgroundColor: '#eff6ff' }}
                  >
                    <Shield size={14} />
                    Quản trị
                  </Link>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: theme === 'dark' ? '#cbd5e1' : '#475569', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User pill */}
                <div
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '40px',
                    padding: '5px 8px 5px 6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}
                >
                  <div style={{
                    width: '28px', height: '28px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={14} color="#2563eb" />
                  </div>
                  <Link
                    to="/profile"
                    style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', transition: 'color 0.2s', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2563eb'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#0f172a'}
                  >
                    {user.fullName || 'Tài khoản'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    style={{
                      width: '28px', height: '28px', border: 'none',
                      backgroundColor: 'transparent', borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#94a3b8', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#fee2e2';
                      (e.currentTarget as HTMLElement).style.color = '#e11d48';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  style={{ textDecoration: 'none', color: '#475569' }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  Đăng ký miễn phí
                </Link>
              </>
            )}
          </div>

          {/* ── HAMBURGER MOBILE ─────────────────── */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: mobileOpen ? '#eff6ff' : 'transparent',
              border: mobileOpen ? '1px solid #dbeafe' : '1px solid transparent',
              color: mobileOpen ? '#2563eb' : '#475569',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE MENU OVERLAY
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, top: 'var(--nav-height)',
                backgroundColor: 'rgba(15,23,42,0.4)',
                zIndex: 40,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 'var(--nav-height)', right: 0, bottom: 0,
                width: 'min(320px, 90vw)',
                backgroundColor: '#ffffff',
                zIndex: 50,
                overflowY: 'auto',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>

                {/* Trang chủ */}
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                  style={{
                    color: isActive('/') ? '#2563eb' : '#0f172a',
                    backgroundColor: isActive('/') ? '#eff6ff' : 'transparent',
                    fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  }}
                >
                  <LayoutGrid size={18} />
                  Trang chủ
                </Link>

                <Link
                  to="/campaigns"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    color: isActive('/campaigns') ? '#2563eb' : '#0f172a',
                    backgroundColor: isActive('/campaigns') ? '#eff6ff' : 'transparent',
                    fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  }}
                >
                  <HeartHandshake size={18} />
                  Chiến dịch
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    color: isActive('/contact') ? '#2563eb' : '#0f172a',
                    backgroundColor: isActive('/contact') ? '#eff6ff' : 'transparent',
                    fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  }}
                >
                  <Mail size={18} />
                  Liên hệ
                </Link>

                {/* Dropdown sections mobile */}
                {Object.keys(menuData).map((key) => (
                  <div key={key}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent',
                        color: '#0f172a', fontWeight: 600, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <span>{menuData[key].title}</span>
                      <motion.span
                        animate={{ rotate: mobileExpanded === key ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', color: '#64748b' }}
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {mobileExpanded === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden', paddingLeft: '8px' }}
                        >
                          {menuData[key].items.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1"
                              style={{ color: '#475569', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                            >
                              <span style={{ color: '#2563eb' }}>{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '8px 0' }} />

                {/* Auth mobile */}
                {token ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ color: '#0f172a', fontWeight: 600, fontSize: '15px', textDecoration: 'none', backgroundColor: '#f8fafc' }}
                    >
                      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#2563eb" />
                      </div>
                      {user.fullName || 'Tài khoản'}
                    </Link>
                    {(user.role === 'VOLUNTEER' || user.role === 'USER') && (
                      <Link to="/my-activities" className="btn btn-outline" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                        <ClipboardList size={15} /> Việc của tôi
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn"
                      style={{ background: '#fee2e2', color: '#e11d48', border: 'none', justifyContent: 'center' }}
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/login" className="btn btn-outline" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                      Đăng ký miễn phí
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}