import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, MapPin, Clock, Users } from 'lucide-react';

interface CampaignProps {
  campaign: any;
}

// ─── Skeleton Loading Card ────────────────────────
export function CampaignCardSkeleton() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '18px',
      overflow: 'hidden',
      border: '1px solid rgba(226,232,240,0.7)',
    }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '0' }} />
      <div style={{ padding: '16px' }}>
        <div className="skeleton" style={{ height: '16px', borderRadius: '6px', marginBottom: '10px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', borderRadius: '6px', width: '60%' }} />
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <div className="skeleton" style={{ height: '8px', borderRadius: '4px', flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

export default function CampaignCard({ campaign }: CampaignProps) {
  // ── Tính % đăng ký ────────────────────────────
  const currentVolunteers = campaign.currentVolunteers || 0;
  const requiredVolunteers = campaign.requiredVolunteers || 1;
  const percent = Math.min(Math.round((currentVolunteers / requiredVolunteers) * 100), 100);

  // ── Tính số ngày còn lại ──────────────────────
  let daysLeftText = 'Đang cập nhật';
  let daysLeftColor = '#64748b';
  if (campaign.endDate) {
    const today = new Date();
    const endDate = new Date(campaign.endDate);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (daysLeft > 0) {
      daysLeftText = `Còn ${daysLeft} ngày`;
      daysLeftColor = daysLeft <= 7 ? '#f97316' : '#64748b';
    } else if (daysLeft === 0) {
      daysLeftText = 'Kết thúc hôm nay';
      daysLeftColor = '#f97316';
    } else {
      daysLeftText = 'Đã kết thúc';
      daysLeftColor = '#94a3b8';
    }
  }

  // ── Màu progress bar ─────────────────────────
  const progressColor = percent >= 80
    ? 'linear-gradient(90deg, #10b981, #34d399)'
    : percent >= 50
      ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
      : 'linear-gradient(90deg, #f59e0b, #fbbf24)';

  return (
    <Link to={`/campaign/${campaign.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <motion.div
        className="card-premium"
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* ─────────── ẢNH ─────────── */}
        <div
          className="card-image"
          style={{
            position: 'relative', width: '100%', height: '200px',
            overflow: 'hidden', backgroundColor: '#f1f5f9',
          }}
        >
          <img
            src={
              campaign.image
                ? `http://localhost:5000${campaign.image}`
                : `https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80`
            }
            alt={campaign.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Badge loại */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(8px)',
          }}>
            <HeartHandshake size={12} color="#059669" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', letterSpacing: '0.02em' }}>
              {campaign.type === 'INDIVIDUAL' ? 'CLB' : 'Trường/Khoa'}
            </span>
          </div>

          {/* Gradient + progress bar overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)',
            padding: '28px 14px 14px',
          }}>
            {/* Progress info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '11.5px', fontWeight: 600, marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={11} />
                {currentVolunteers}/{requiredVolunteers} người
              </span>
              <span style={{
                background: percent >= 80 ? 'rgba(16,185,129,0.8)' : 'rgba(255,255,255,0.2)',
                borderRadius: '4px', padding: '1px 6px',
              }}>
                {percent}%
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                style={{ height: '100%', background: progressColor, borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* ─────────── NỘI DUNG ─────────── */}
        <div style={{ padding: '16px 16px 18px' }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#0f172a', fontSize: '15px', fontWeight: 700,
            lineHeight: '1.4',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            letterSpacing: '-0.01em',
          }}>
            {campaign.title}
          </h3>

          {/* Meta info */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {campaign.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: '#64748b', fontWeight: 500 }}>
                <MapPin size={12} color="#94a3b8" />
                {campaign.location}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: daysLeftColor }}>
              <Clock size={12} />
              {daysLeftText}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}