import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Users, Flag, ClipboardCheck, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get('/stats/dashboard')
           .then(res => setStats(res.data.data))
           .catch(console.error);
    }, []);

    if (!stats) return <div style={{ padding: '30px' }}>Đang tải dữ liệu...</div>;

    const { overview, chartData } = stats;

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ color: '#1e1e2d', marginBottom: '25px', fontSize: '28px' }}>👋 Tổng quan Hệ thống</h2>

            {/* 4 THẺ CHỈ SỐ TỔNG QUAN */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <StatCard icon={<Users size={30} color="#0984e3"/>} title="Tổng Tình nguyện viên" value={overview.totalVolunteers} color="#e1f5fe" />
                <StatCard icon={<Flag size={30} color="#d63031"/>} title="Chiến dịch đã mở" value={overview.totalCampaigns} color="#ff7675" />
                <StatCard icon={<ClipboardCheck size={30} color="#e67e22"/>} title="Tổng đơn đăng ký" value={overview.totalRegistrations} color="#ffeaa7" />
                <StatCard icon={<CheckCircle size={30} color="#00b894"/>} title="Đơn đã phê duyệt" value={overview.approvedRegistrations} color="#55efc4" />
            </div>

            {/* BIỂU ĐỒ THỐNG KÊ */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', color: '#2d3436' }}>📊 Thống kê lực lượng Tình nguyện viên theo Khoa</h3>
                <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: '#f1f2f6'}} />
                            <Legend />
                            <Bar dataKey="totalStudents" name="Số lượng Sinh viên" fill="#0984e3" radius={[5, 5, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Component phụ trợ vẽ Thẻ chỉ số
const StatCard = ({ icon, title, value, color }: any) => (
    <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '15px', backgroundColor: color, borderRadius: '50%', display: 'flex' }}>
            {icon}
        </div>
        <div>
            <p style={{ margin: 0, color: '#636e72', fontSize: '15px', fontWeight: 'bold' }}>{title}</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#2d3436', fontSize: '32px' }}>{value}</h2>
        </div>
    </div>
);