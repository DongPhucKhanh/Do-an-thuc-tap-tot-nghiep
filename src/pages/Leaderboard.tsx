import { useState, useEffect } from 'react';
import { Trophy, Users } from 'lucide-react';
import api from '../api/axios';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Gọi API backend (Đảm bảo route '/campaigns/leaderboard' đã chạy)
                const res = await api.get('/campaigns/leaderboard');
                setLeaderboard(res.data.data);
            } catch (error) {
                console.error("Lỗi tải bảng xếp hạng", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const medalColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
        0: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', glow: 'rgba(251,191,36,0.25)' },
        1: { bg: '#f8fafc', border: '#cbd5e1', text: '#475569', glow: 'rgba(148,163,184,0.2)' },
        2: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', glow: 'rgba(251,146,60,0.2)' },
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '48px 20px' }}>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '72px',
                        height: '72px',
                        backgroundColor: '#fef9c3',
                        borderRadius: '50%',
                        marginBottom: '18px',
                        boxShadow: '0 0 0 8px rgba(251,191,36,0.15)',
                        border: '2px solid #fde68a',
                    }}>
                        <Trophy size={36} color="#d97706" strokeWidth={1.8} />
                    </div>
                    <h2 style={{
                        fontSize: '28px',
                        color: '#0f172a',
                        fontWeight: '800',
                        margin: '0 0 10px 0',
                        letterSpacing: '-0.03em',
                    }}>
                        Bảng Xếp Hạng Thi Đua
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0, maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Vinh danh các Khoa có số lượt sinh viên & thầy cô tham gia tình nguyện tích cực nhất
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px', fontSize: '15px' }}>
                        Đang tính toán số liệu thi đua...
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 4px 32px rgba(0,0,0,0.07), 0 1px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        border: '1px solid rgba(226,232,240,0.7)',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr 140px',
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #f1f5f9',
                            padding: '14px 24px',
                        }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Hạng</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tên Đơn Vị / Khoa</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Lượt tham gia</div>
                        </div>

                        {leaderboard.map((item, index) => {
                            const medal = medalColors[index];
                            return (
                                <div
                                    key={index}
                                    className="lb-row"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '80px 1fr 140px',
                                        padding: '18px 24px',
                                        alignItems: 'center',
                                        borderBottom: index < leaderboard.length - 1 ? '1px solid #f8fafc' : 'none',
                                        backgroundColor: medal ? medal.bg : 'white',
                                        boxShadow: medal ? `inset 3px 0 0 ${medal.border}` : 'inset 3px 0 0 transparent',
                                    }}
                                >
                                    {/* Rank */}
                                    <div style={{ textAlign: 'center' }}>
                                        {index === 0 ? (
                                            <span style={{ fontSize: '30px' }}>🥇</span>
                                        ) : index === 1 ? (
                                            <span style={{ fontSize: '30px' }}>🥈</span>
                                        ) : index === 2 ? (
                                            <span style={{ fontSize: '30px' }}>🥉</span>
                                        ) : (
                                            <span style={{
                                                fontWeight: '700',
                                                color: '#94a3b8',
                                                fontSize: '17px',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}>{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Faculty Name */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '36px', height: '36px',
                                            backgroundColor: medal ? medal.border : '#f1f5f9',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Users size={18} color={medal ? medal.text : '#64748b'} />
                                        </div>
                                        <span style={{
                                            fontWeight: index < 3 ? '700' : '600',
                                            color: index < 3 ? '#0f172a' : '#374151',
                                            fontSize: '15px',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {item.faculty}
                                        </span>
                                    </div>

                                    {/* Count */}
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            fontWeight: '800',
                                            color: '#059669',
                                            fontSize: '18px',
                                            letterSpacing: '-0.02em',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {item.count}
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '4px', fontWeight: '500' }}>lượt</span>
                                    </div>
                                </div>
                            );
                        })}

                        {leaderboard.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '15px' }}>
                                Chưa có số liệu thi đua nào được ghi nhận.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}