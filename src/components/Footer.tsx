import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo-doan-thanh-nien-vector-4.jpg';

// Inline SVG social icons (lucide-react này chưa có social icons)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.5a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── Dữ liệu Footer ────────────────────────────────
const footerLinks = {
  explore: {
    title: 'Khám phá',
    links: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Chiến dịch', href: '/campaigns' },
      { label: 'Bảng xếp hạng', href: '/leaderboard' },
      { label: 'Thư viện ảnh', href: '/gallery' },
      { label: 'Hoạt động gần đây', href: '/nearest-campaigns' },
    ]
  },
  info: {
    title: 'Thông tin',
    links: [
      { label: 'Tin tức & Câu chuyện', href: '/news' },
      { label: 'Điểm rèn luyện', href: '/training-point' },
      { label: 'Quy chế rèn luyện', href: '/training-regulations' },
      { label: 'Cẩm nang tình nguyện', href: '/handbook' },
    ]
  },
  legal: {
    title: 'Pháp lý',
    links: [
      { label: 'Chính sách bảo mật', href: '#' },
      { label: 'Điều khoản sử dụng', href: '#' },
      { label: 'Quy tắc cộng đồng', href: '#' },
      { label: 'Hướng dẫn đăng ký', href: '#' },
    ]
  }
};

const socialLinks = [
  { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
  { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
  { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
  { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
  { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
];

const stats = [
  { value: '2,000+', label: 'Tình nguyện viên' },
  { value: '150+', label: 'Chiến dịch' },
  { value: '50+', label: 'Tổ chức' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Decorative gradient blobs ─────────────── */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '40px', right: '-40px',
        width: '240px', height: '240px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ══════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════ */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: '48px',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '28px', fontWeight: 800, color: '#ffffff',
                  letterSpacing: '-0.04em', lineHeight: 1,
                  background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 500, letterSpacing: '0.03em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN FOOTER CONTENT
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px 40px',
        }}>

          {/* ── COL 1: Brand ─────────────────────── */}
          <div style={{ gridColumn: 'span 1' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', textDecoration: 'none' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.12)',
                flexShrink: 0,
              }}>
                <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  ThienNguyen
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 500 }}>
                  Nền tảng tình nguyện
                </div>
              </div>
            </Link>

            {/* Mô tả */}
            <p style={{
              fontSize: '13.5px', color: '#64748b', lineHeight: '1.7',
              marginBottom: '24px', maxWidth: '240px', fontWeight: 400,
            }}>
              Nền tảng kết nối tình nguyện viên và tổ chức từ thiện, cùng nhau xây dựng cộng đồng tốt đẹp hơn.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="footer-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 2–4: Links ───────────────────── */}
          {Object.values(footerLinks).map((section, i) => (
            <div key={i}>
              <h4 style={{
                fontSize: '12px', fontWeight: 700, color: '#e2e8f0',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── COL 5: Contact ───────────────────── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 700, color: '#e2e8f0',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Liên hệ
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Email */}
              <a href="mailto:volunteer@university.edu.vn" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textDecoration: 'none' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <Mail size={13} color="#60a5fa" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                  <div style={{ fontSize: '13.5px', color: '#94a3b8', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                  >
                    volunteer@university.edu.vn
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:+842838xxxxxx" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textDecoration: 'none' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <Phone size={13} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>Điện thoại</div>
                  <div style={{ fontSize: '13.5px', color: '#94a3b8' }}>
                    (028) 3838 xxxx
                  </div>
                </div>
              </a>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '3px',
                }}>
                  <MapPin size={13} color="#fb923c" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>Địa chỉ</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                    Trường Đại học Công nghệ<br />
                    Thông tin — ĐHQG TP.HCM<br />
                    Khu phố 6, Linh Trung, Thủ Đức
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ───────────────────────── */}
        <div style={{
          marginTop: '56px',
          padding: '28px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(16,185,129,0.08) 100%)',
          border: '1px solid rgba(37,99,235,0.15)',
          display: 'flex', flexWrap: 'wrap', gap: '20px',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
              Nhận thông báo hoạt động mới
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Đừng bỏ lỡ các chiến dịch tình nguyện ý nghĩa.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.10)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#f1f5f9', fontSize: '13.5px',
                outline: 'none', minWidth: '200px', fontFamily: 'inherit',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(37,99,235,0.5)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)'}
            />
            <button
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              }}
            >
              Đăng ký
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '20px 24px',
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            © {currentYear} ThienNguyen Platform. Được xây dựng với{' '}
            <Heart size={12} style={{ display: 'inline', color: '#e11d48', marginBottom: '-1px' }} />{' '}
            bởi sinh viên UIT.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {['Chính sách bảo mật', 'Điều khoản', 'Cookie'].map((text, i) => (
              <a key={i} href="#" className="footer-link" style={{ fontSize: '12.5px' }}>
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
