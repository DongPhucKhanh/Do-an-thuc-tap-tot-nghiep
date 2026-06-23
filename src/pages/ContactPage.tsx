import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function ContactPage() {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/contacts', formData);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            alert('Lỗi khi gửi liên hệ. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 dark:bg-slate-900 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Mọi thắc mắc, góp ý hoặc cần hỗ trợ về các hoạt động tình nguyện, xin vui lòng gửi tin nhắn cho chúng tôi. Ban quản trị sẽ phản hồi bạn trong thời gian sớm nhất.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Cột thông tin liên hệ */}
                    <div className="col-span-1 space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Địa chỉ</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Văn phòng Đoàn Thanh Niên, Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM. Khu phố 6, P.Linh Trung, Tp.Thủ Đức.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Điện thoại</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    0123 456 789<br />
                                    (Giờ hành chính Thứ 2 - Thứ 6)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Email</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    hotro.tinhnguyen@uit.edu.vn
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cột Form Liên Hệ */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-10">
                            
                            {isSuccess ? (
                                <div className="text-center py-10 animate-fade-in">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Đã gửi thành công!</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                        Cảm ơn bạn đã liên hệ. Chúng tôi đã nhận được tin nhắn và sẽ phản hồi qua email của bạn trong vòng 24h tới.
                                    </p>
                                    <button 
                                        onClick={() => setIsSuccess(false)}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                    >
                                        Gửi tin nhắn khác
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Họ và tên *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                                            <input 
                                                type="email" 
                                                required 
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tiêu đề *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={formData.subject}
                                            onChange={e => setFormData({...formData, subject: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Bạn cần hỗ trợ về vấn đề gì?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Lời nhắn *</label>
                                        <textarea 
                                            required 
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                            placeholder="Nội dung chi tiết..."
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <><Send size={18} /> Gửi liên hệ</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
