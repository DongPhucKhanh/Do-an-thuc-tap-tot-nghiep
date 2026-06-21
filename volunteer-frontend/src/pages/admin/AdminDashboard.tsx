import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Flag, ClipboardCheck, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { palette } from '../../styles/adminTheme';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    useEffect(() => {
        api.get('/stats/dashboard')
           .then(res => setStats(res.data.data))
           .catch(console.error);
    }, []);

    if (!stats) return <div style={{ padding: '20px', color: p.textMuted }}>Đang tải dữ liệu...</div>;

    const { overview, chartData } = stats;

    return (
        <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 600, color: p.text }}>Tổng quan Hệ thống</h2>

            {/* 4 THẺ CHỈ SỐ TỔNG QUAN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard icon={<Users size={20} color="#2563eb"/>} title="Tổng Tình nguyện viên" value={overview.totalVolunteers} isDark={isDark} />
                <StatCard icon={<Flag size={20} color="#dc2626"/>} title="Chiến dịch đã mở" value={overview.totalCampaigns} isDark={isDark} />
                <StatCard icon={<ClipboardCheck size={20} color="#d97706"/>} title="Tổng đơn đăng ký" value={overview.totalRegistrations} isDark={isDark} />
                <StatCard icon={<CheckCircle size={20} color="#16a34a"/>} title="Đơn đã phê duyệt" value={overview.approvedRegistrations} isDark={isDark} />
            </div>

            {/* BIỂU ĐỒ THỐNG KÊ */}
            <div style={{
                backgroundColor: p.surfaceAlt,
                padding: '20px',
                borderRadius: '6px',
                border: `1px solid ${p.border}`
            }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: p.textSub }}>Thống kê Tình nguyện viên theo Khoa</h3>
                <div style={{ width: '100%', height: '360px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e7eb'} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: p.textMuted }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: p.textMuted }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: p.surface,
                                    border: `1px solid ${p.border}`,
                                    borderRadius: '6px',
                                    color: p.text
                                }}
                                cursor={{ fill: isDark ? '#263244' : '#f3f4f6' }}
                            />
                            <Legend wrapperStyle={{ color: p.textSub }} />
                            <Bar dataKey="totalStudents" name="Số lượng Sinh viên" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Component phụ trợ vẽ Thẻ chỉ số
const StatCard = ({ icon, title, value, isDark }: any) => {
    const p = isDark ? palette.dark : palette.light;
    return (
        <div style={{
            backgroundColor: p.surface,
            padding: '16px 20px',
            borderRadius: '6px',
            border: `1px solid ${p.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '6px',
                backgroundColor: isDark ? '#263244' : '#f3f4f6', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, color: p.textMuted, fontSize: '12px', fontWeight: 500 }}>{title}</p>
                <h2 style={{ margin: '4px 0 0 0', color: p.text, fontSize: '26px', fontWeight: 700 }}>{value}</h2>
            </div>
        </div>
    );
};