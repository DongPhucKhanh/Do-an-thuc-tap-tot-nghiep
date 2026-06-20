import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  CloudRainWind, PiggyBank, ShieldPlus, Baby, UserMinus,
  HeartHandshake, Accessibility, ArrowRight, Users, Trophy, Zap,
  Star, TrendingUp
} from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import api from '../api/axios';
import CampaignCard, { CampaignCardSkeleton } from '../components/CampaignCard';
import LatestNewsSection from '../components/LatestNewsSection';

// ════════════════════════════════════════════════════
//  ANIMATED COUNTER (đếm số khi scroll vào viewport)
// ════════════════════════════════════════════════════
function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView, value]);

  useEffect(() => {
    return springValue.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toLocaleString('vi-VN');
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

// ════════════════════════════════════════════════════
//  STAT ITEM
// ════════════════════════════════════════════════════
function StatItem({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) {
  const numValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : (value || 0);
  const suffix = typeof value === 'string' && value.includes('+') ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(226,232,240,0.8)',
        borderRadius: '20px',
        padding: '28px 24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.09)' }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: `${color}15`,
        border: `1.5px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px', color,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '36px', fontWeight: 800, color: '#0f172a',
        letterSpacing: '-0.04em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        marginBottom: '8px',
      }}>
        <AnimatedNumber value={numValue} />
        {suffix}
      </div>
      <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#64748b' }}>{label}</div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════
//  SECTION HEADER
// ════════════════════════════════════════════════════
function SectionHeader({ eyebrow, title, subtitle, href, linkText }:
  { eyebrow?: string; title: string; subtitle?: string; href?: string; linkText?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}
    >
      <div>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {href && linkText && (
        <Link
          to={href}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '14px', fontWeight: 600, color: '#2563eb',
            textDecoration: 'none',
            border: '1.5px solid #dbeafe', borderRadius: '10px',
            padding: '8px 16px', backgroundColor: '#eff6ff',
            transition: 'all 0.2s ease', flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#dbeafe';
            (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#eff6ff';
            (e.currentTarget as HTMLElement).style.borderColor = '#dbeafe';
          }}
        >
          {linkText}
          <ArrowRight size={14} />
        </Link>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════
//  CAMPAIGN SLIDER SECTION
// ════════════════════════════════════════════════════
function CampaignSlider({ id, campaigns, loading }: { id: string; campaigns: any[]; loading: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Prev button */}
      {campaigns.length > 3 && (
        <button
          onClick={() => document.getElementById(id)?.scrollBy({ left: -340, behavior: 'smooth' })}
          style={{
            position: 'absolute', left: '-18px', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10, width: '40px', height: '40px',
            backgroundColor: 'white',
            border: '1.5px solid #e2e8f0',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.16)';
            (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          }}
        >
          <ChevronLeft size={18} color="#475569" />
        </button>
      )}

      {/* Slider track */}
      <div
        id={id}
        className="hide-scroll"
        style={{
          display: 'flex', gap: '20px',
          overflowX: 'auto', paddingBottom: '8px',
          scrollBehavior: 'smooth',
        }}
      >
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{ minWidth: '300px', maxWidth: '320px', flexShrink: 0 }}>
              <CampaignCardSkeleton />
            </div>
          ))
        ) : campaigns.length > 0 ? (
          campaigns.map((camp, i) => (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{ minWidth: '300px', maxWidth: '320px', flexShrink: 0 }}
            >
              <CampaignCard campaign={camp} />
            </motion.div>
          ))
        ) : (
          <div style={{
            width: '100%', textAlign: 'center', padding: '56px',
            color: '#94a3b8', backgroundColor: 'white',
            borderRadius: '20px', border: '1.5px dashed #e2e8f0',
            fontSize: '15px', minWidth: '500px',
          }}>
            Chưa có chiến dịch nào.
          </div>
        )}
      </div>

      {/* Next button */}
      {campaigns.length > 3 && (
        <button
          onClick={() => document.getElementById(id)?.scrollBy({ left: 340, behavior: 'smooth' })}
          style={{
            position: 'absolute', right: '-18px', top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10, width: '40px', height: '40px',
            backgroundColor: 'white',
            border: '1.5px solid #e2e8f0',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.16)';
            (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          }}
        >
          <ChevronRight size={18} color="#475569" />
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  COMPONENT MỚI: TỔ CHỨC ĐỒNG HÀNH NỔI BẬT (Style Nền Cam)
// ════════════════════════════════════════════════════
const TopOrganizations = () => {
  // Data giả lập các tổ chức/CLB nổi bật (Mày có thể call API thay thế sau)
  const orgs = [
    {
      id: 1,
      name: 'Đoàn Thanh niên Trường',
      handle: '@doanthanhnien',
      desc: 'Tổ chức chính trị - xã hội của thanh niên, dẫn dắt các phong trào tình nguyện cốt lõi và các chiến dịch Mùa Hè Xanh toàn trường.',
      statLabel: 'Lượt tình nguyện viên',
      statValue: '12,450',
      logo: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=200&auto=format&fit=crop', // Thay bằng logo thực tế
    },
    {
      id: 2,
      name: 'Đội Công tác Xã hội',
      handle: '@congtacxahoi',
      desc: 'Tập hợp những trái tim nhiệt huyết, chuyên tổ chức các chương trình thiện nguyện, mái ấm nhà mở và hiến máu nhân đạo.',
      statLabel: 'Lượt tình nguyện viên',
      statValue: '8,320',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Câu lạc bộ Môi trường',
      handle: '@greenclub',
      desc: 'Hành động vì một môi trường xanh - sạch - đẹp. Thường xuyên tổ chức các chiến dịch dọn rác, trồng cây và tái chế.',
      statLabel: 'Lượt tình nguyện viên',
      statValue: '5,100',
      logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=200&auto=format&fit=crop',
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ 
        position: 'relative', 
        backgroundColor: '#f97316', // Màu cam rực rỡ y hệt ảnh mẫu
        backgroundImage: 'radial-gradient(circle at top right, #fb923c, #ea580c)',
        borderRadius: '24px', 
        padding: '40px 32px 56px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(234, 88, 12, 0.2)'
      }}>
        
        {/* Họa tiết trang trí nền (Wavy background effect) */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', border: '40px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        {/* Tiêu đề Component */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            Tổ chức, Câu lạc bộ nổi bật
          </h2>
        </div>

        {/* Lưới chứa các Thẻ (Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', position: 'relative', zIndex: 10 }}>
          {orgs.map((org) => (
            <div key={org.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '20px', 
              padding: '48px 24px 24px', 
              textAlign: 'center', 
              position: 'relative',
              marginTop: '40px', // Đẩy thẻ xuống để chừa chỗ cho logo nổi lên
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >
              {/* Logo bay lơ lửng */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '4px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }}>
                <img src={org.logo} alt={org.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>

              {/* Thông tin Tổ chức */}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{org.name}</h3>
              <p style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, marginBottom: '12px' }}>{org.handle}</p>
              
              <p style={{ 
                fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px', 
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
              }}>
                {org.desc}
              </p>

              {/* Số liệu nổi bật */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{org.statLabel}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ea580c' }}>
                  {org.statValue} <span style={{ fontSize: '14px', fontWeight: 600 }}>TNV</span>
                </div>
              </div>

              {/* Nút Call to Action */}
             
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════
//  MAIN HOME COMPONENT
// ════════════════════════════════════════════════════
export default function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // ── Load data ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campRes, bannerRes, catRes, statsRes] = await Promise.all([
          api.get('/campaigns'),
          api.get('/banners'),
          api.get('/categories'),
          api.get('/campaigns/system-stats'),
        ]);
        setCampaigns(campRes.data.data.filter((c: any) => c.status === 'OPEN'));
        setBanners(bannerRes.data.data);
        setCategories(catRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Auto-slide banners ────────────────────────
  useEffect(() => {
    if (banners.length > 1) {
      const t = setInterval(() => setCurrentSlide(p => (p + 1) % banners.length), 4500);
      return () => clearInterval(t);
    }
  }, [banners.length]);

  // ── Auto-slide campaigns ──────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const slideIt = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
          const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
          if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
          else el.scrollBy({ left: 340, behavior: 'smooth' });
        }
      };
      if (!selectedCategory) { slideIt('org-slider'); slideIt('ind-slider'); }
    }, 4000);
    return () => clearInterval(t);
  }, [selectedCategory]);

  // ── Category icon ─────────────────────────────
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('thiên tai') || n.includes('môi trường')) return <CloudRainWind size={24} strokeWidth={1.8} />;
    if (n.includes('nghèo')) return <PiggyBank size={24} strokeWidth={1.8} />;
    if (n.includes('đói') || n.includes('y tế')) return <ShieldPlus size={24} strokeWidth={1.8} />;
    if (n.includes('trẻ em') || n.includes('giáo dục')) return <Baby size={24} strokeWidth={1.8} />;
    if (n.includes('cao tuổi') || n.includes('già')) return <UserMinus size={24} strokeWidth={1.8} />;
    if (n.includes('khuyết tật')) return <Accessibility size={24} strokeWidth={1.8} />;
    return <HeartHandshake size={24} strokeWidth={1.8} />;
  };

  // ── Filter ────────────────────────────────────
  const filtered = selectedCategory ? campaigns.filter(c => c.categoryId === selectedCategory) : campaigns;
  const orgCampaigns = filtered.filter(c => c.type === 'ORGANIZATION' || !c.type);
  const indCampaigns = filtered.filter(c => c.type === 'INDIVIDUAL');

  // ── Stats data ────────────────────────────────
  const statItems = [
    { label: 'Tổ chức tình nguyện', value: stats?.totalOrgs || 0, color: '#2563eb', icon: <Trophy size={20} /> },
    { label: 'Câu lạc bộ / Nhóm', value: stats?.totalIndiv || 0, color: '#10b981', icon: <Star size={20} /> },
    { label: 'Chiến dịch đang mở', value: stats?.totalCampaigns || 0, color: '#f59e0b', icon: <Zap size={20} /> },
    { label: 'Tình nguyện viên', value: stats?.totalUsers || 0, color: '#8b5cf6', icon: <Users size={20} /> },
    { label: 'Lượt đăng ký', value: stats?.totalRegistrations || 0, color: '#0891b2', icon: <TrendingUp size={20} /> },
    { label: 'Hoạt động hoàn thành', value: (stats?.totalRegistrations || 0) * 2, color: '#e11d48', icon: <HeartHandshake size={20} /> },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════ */}
      {banners.length > 0 ? (
        /* ─ Dynamic banner ─ */
        <div style={{ position: 'relative', width: '100%', height: '560px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              style={{
                position: 'absolute', inset: 0,
                transition: 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                opacity: currentSlide === idx ? 1 : 0,
                zIndex: currentSlide === idx ? 1 : 0,
              }}
            >
              <img
                src={banner.imageUrl ? `http://localhost:5000${banner.imageUrl}` : 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80'}
                alt={banner.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center',
                maxWidth: '1200px', margin: '0 auto',
                padding: '0 48px',
              }}>
                {currentSlide === idx && (
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ maxWidth: '580px' }}
                  >
                    {/* Eyebrow */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      backgroundColor: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.20)',
                      backdropFilter: 'blur(10px)',
                      padding: '6px 16px', borderRadius: '999px', marginBottom: '24px',
                    }}>
                      <HeartHandshake size={14} color="#86efac" />
                      <span style={{ color: '#86efac', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.06em' }}>
                        TÌNH NGUYỆN VIÊN
                      </span>
                    </div>

                    <h1 style={{
                      color: 'white', fontSize: 'clamp(32px, 5vw, 50px)',
                      fontWeight: 800, lineHeight: 1.12, marginBottom: '20px',
                      letterSpacing: '-0.03em',
                    }}>
                      {banner.title || 'Chung tay vì cộng đồng'}
                    </h1>

                    <p style={{
                      color: 'rgba(255,255,255,0.78)', fontSize: '17px',
                      lineHeight: 1.65, marginBottom: '32px', maxWidth: '440px',
                    }}>
                      Khám phá những cơ hội tình nguyện ý nghĩa và tạo nên sự khác biệt ngay hôm nay.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Link
                        to="/campaigns"
                        className="btn btn-success btn-lg"
                        style={{ textDecoration: 'none' }}
                      >
                        <HeartHandshake size={18} />
                        Khám phá ngay
                      </Link>
                      <Link
                        to="/register"
                        className="btn btn-lg"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          color: 'white',
                          border: '1.5px solid rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(8px)',
                          textDecoration: 'none',
                        }}
                      >
                        Tham gia miễn phí
                      </Link>
                    </div>

                    {/* Quick stats */}
                    <div style={{ display: 'flex', gap: '28px', marginTop: '40px', flexWrap: 'wrap' }}>
                      {[
                        { val: `${stats?.totalUsers || '2,000'}+`, lbl: 'Tình nguyện viên' },
                        { val: `${stats?.totalCampaigns || '150'}+`, lbl: 'Chiến dịch' },
                        { val: `${stats?.totalOrgs || '50'}+`, lbl: 'Tổ chức' },
                      ].map((s, i) => (
                        <div key={i}>
                          <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>{s.val}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}

          {/* Slide dots */}
          {banners.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '28px', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 10,
            }}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '28px' : '8px',
                    height: '8px', borderRadius: '4px', border: 'none',
                    cursor: 'pointer', padding: 0,
                    backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.35s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ─ Fallback Hero ─ */
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
          padding: '100px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Background circles */}
          <div style={{
            position: 'absolute', top: '-100px', right: '-100px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-80px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '6px 18px', borderRadius: '999px', marginBottom: '28px',
            }}>
              <HeartHandshake size={14} color="#86efac" />
              <span style={{ color: '#86efac', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>
                NỀN TẢNG TÌNH NGUYỆN HÀNG ĐẦU
              </span>
            </div>

            <h1 style={{
              color: 'white', fontSize: 'clamp(36px, 6vw, 60px)',
              fontWeight: 900, lineHeight: 1.08, marginBottom: '24px',
              letterSpacing: '-0.04em',
            }}>
              Chào mừng đến với<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                ThienNguyen
              </span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.68)', fontSize: '18px',
              lineHeight: 1.6, marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px',
            }}>
              Kết nối tình nguyện viên với những chiến dịch ý nghĩa, xây dựng cộng đồng tốt đẹp hơn mỗi ngày.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/campaigns" className="btn btn-success btn-lg" style={{ textDecoration: 'none' }}>
                <HeartHandshake size={18} /> Xem chiến dịch
              </Link>
              <Link to="/register" className="btn btn-lg" style={{
                textDecoration: 'none',
                backgroundColor: 'rgba(255,255,255,0.10)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}>
                Đăng ký tham gia
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          2. CATEGORY FILTER BAR
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            border: '1px solid rgba(226,232,240,0.8)',
            padding: '24px 28px',
            marginTop: '-36px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            id="category-slider"
            className="hide-scroll"
            style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}
          >
            {/* "Tất cả" button */}
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                flexShrink: 0, padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit',
                backgroundColor: !selectedCategory ? '#eff6ff' : 'transparent',
                color: !selectedCategory ? '#2563eb' : '#64748b',
                border: !selectedCategory ? '1.5px solid #dbeafe' : '1.5px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '6px', flexShrink: 0, minWidth: '80px',
                  padding: '10px 12px', borderRadius: '14px', cursor: 'pointer',
                  border: 'none', fontFamily: 'inherit',
                  backgroundColor: selectedCategory === cat.id ? '#eff6ff' : 'transparent',
                  outline: selectedCategory === cat.id ? '1.5px solid #dbeafe' : '1.5px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: selectedCategory === cat.id ? '#dbeafe' : '#f0f9ff',
                  color: selectedCategory === cat.id ? '#1d4ed8' : '#0ea5e9',
                  transition: 'all 0.2s ease',
                }}>
                  {getCategoryIcon(cat.name)}
                </div>
                <span style={{
                  fontSize: '11.5px', fontWeight: selectedCategory === cat.id ? 700 : 500,
                  textAlign: 'center', color: selectedCategory === cat.id ? '#1d4ed8' : '#64748b',
                  lineHeight: 1.3, transition: 'color 0.2s',
                }}>
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>

          {selectedCategory && (
            <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  color: '#64748b', backgroundColor: 'transparent', border: 'none',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0f172a'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          3. ORGANIZATION CAMPAIGNS
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 36px 0' }}>
        <SectionHeader
          eyebrow="Chiến dịch chính thống"
          title="Hoạt động từ Trường / Khoa"
          subtitle="Các chương trình quy mô lớn được tổ chức bởi nhà trường và khoa"
          href="/campaigns?type=org"
          linkText="Xem tất cả"
        />
        <CampaignSlider id="org-slider" campaigns={orgCampaigns} loading={loading} />
      </div>

      {/* ══════════════════════════════════════════
          4. INDIVIDUAL / CLB CAMPAIGNS
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 36px 0' }}>
        <SectionHeader
          eyebrow="Câu lạc bộ & Nhóm"
          title="Chiến dịch từ Câu Lạc Bộ"
          subtitle="Những hoạt động cộng đồng do các câu lạc bộ và nhóm sinh viên tổ chức"
          href="/campaigns?type=ind"
          linkText="Xem tất cả"
        />
        <CampaignSlider id="ind-slider" campaigns={indCampaigns} loading={loading} />
      </div>

      {/* ══════════════════════════════════════════
          5. STATS SECTION (Đồng hành cùng cộng đồng)
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px' }}>
        
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={12} />
              Số liệu minh bạch
            </span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.03em', lineHeight: 1.2, marginTop: '10px', marginBottom: '12px',
            }}>
              Đồng hành cùng cộng đồng<br />thiện nguyện minh bạch
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
              Từ năm {stats?.year || 2021}, chúng tôi không ngừng nỗ lực kết nối và lan tỏa giá trị tốt đẹp.
            </p>
          </motion.div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '16px',
        }}>
          {statItems.map((item, i) => (
            <StatItem
              key={i}
              label={item.label}
              value={item.value}
              color={item.color}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 🚀 BANNER SLIDER NẰM CHÍNH XÁC Ở ĐÂY (DƯỚI STATS - TRÊN NEWS) 🚀 */}
      <TopOrganizations />

      {/* ══════════════════════════════════════════
          6. NEWS SECTION (Tin tức & Câu chuyện Tình nguyện)
      ══════════════════════════════════════════ */}
      <LatestNewsSection />

    </div>
  );
}