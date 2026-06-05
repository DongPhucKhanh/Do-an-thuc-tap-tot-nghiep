import { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Newspaper, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import api from '../api/axios';

// ─── Skeleton ─────────────────────────────────────
function NewsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Featured skeleton */}
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <div className="skeleton" style={{ height: '280px', borderRadius: '0' }} />
        <div style={{ padding: '20px' }}>
          <div className="skeleton" style={{ height: '12px', width: '80px', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ height: '14px', width: '70%' }} />
        </div>
      </div>
      {/* Small skeletons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9', display: 'flex', height: '130px' }}>
            <div className="skeleton" style={{ width: '140px', borderRadius: '0', flexShrink: 0 }} />
            <div style={{ padding: '16px', flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '70px', marginBottom: '10px' }} />
              <div className="skeleton" style={{ height: '16px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '12px', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stagger animation variants ──────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

export default function LatestNewsSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    api.get('/posts?page=1&limit=3')
      .then(res => setPosts(res.data.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        padding: '80px 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── HEADER ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div>
            <span className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <TrendingUp size={12} />
              Nhật ký hành trình
            </span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2rem)',
              fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.03em', lineHeight: 1.2,
              display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
            }}>
              <Newspaper size={26} style={{ color: '#64748b', flexShrink: 0 }} />
              Tin tức & Câu chuyện Tình nguyện
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px', fontWeight: 400 }}>
              Những khoảnh khắc nhân văn và cập nhật từ các chiến dịch
            </p>
          </div>

          <Link
            to="/news"
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
            Xem tất cả bài viết
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* ── CONTENT ────────────────────────── */}
        {loading ? (
          <NewsSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* FEATURED CARD (large) */}
            {featured && (
              <motion.article
                variants={itemVariants}
                style={{
                  gridColumn: posts.length >= 2 ? 'span 1' : 'span 1',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid rgba(226,232,240,0.8)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
                whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
              >
                <Link to={`/news/${featured.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                    <motion.img
                      src={featured.image?.startsWith('http') ? featured.image : `http://localhost:5000${featured.image}`}
                      alt={featured.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80'; }}
                    />
                    {/* Featured badge */}
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: 'white', fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                    }}>
                      Nổi bật
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '11.5px', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.03em' }}>
                      <Calendar size={11} />
                      {new Date(featured.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{
                      fontSize: '17px', fontWeight: 700, color: '#0f172a',
                      lineHeight: '1.4', letterSpacing: '-0.02em',
                      marginBottom: '10px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {featured.title}
                    </h3>
                    <p style={{
                      fontSize: '13.5px', color: '#64748b', lineHeight: '1.6',
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '16px',
                    }}>
                      {featured.content || 'Không có mô tả.'}
                    </p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '13px', fontWeight: 700, color: '#2563eb',
                      transition: 'gap 0.2s',
                    }}>
                      Đọc bài viết
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* SMALL CARDS */}
            {rest.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(226,232,240,0.8)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.09)' }}
              >
                <Link to={`/news/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Image */}
                  <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#f1f5f9', flexShrink: 0 }}>
                    <motion.img
                      src={post.image?.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80'; }}
                    />
                  </div>
                  {/* Body */}
                  <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' }}>
                        <Calendar size={10} />
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 style={{
                        fontSize: '15px', fontWeight: 700, color: '#0f172a',
                        lineHeight: '1.45', letterSpacing: '-0.01em',
                        marginBottom: '8px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: '13px', color: '#64748b', lineHeight: '1.55',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginBottom: '0',
                      }}>
                        {post.content || 'Không có mô tả.'}
                      </p>
                    </div>
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f8fafc' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 700, color: '#2563eb' }}>
                        Đọc tiếp <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}