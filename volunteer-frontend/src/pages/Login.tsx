import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            alert('Đăng nhập thành công!');
            navigate('/admin'); // Hoặc trang bạn muốn chuyển đến
        } catch (error: any) {
            alert(error.response?.data?.error || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Card chính */}
                <div className="bg-white rounded-3xl shadow-xl p-10">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-white text-3xl">👑</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">ADMIN PANEL</h1>
                        <p className="text-gray-500 mt-2">Đăng nhập để quản lý hệ thống</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all
                                ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg'
                                }`}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Phần hỗ trợ */}
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-500">
                            Quên mật khẩu? <span className="text-blue-600 hover:underline cursor-pointer">Liên hệ quản trị viên</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-400 text-sm">
                    Volunteer Management System © 2026
                </div>
            </div>
        </div>
    );
}