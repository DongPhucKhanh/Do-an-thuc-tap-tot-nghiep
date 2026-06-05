import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Heart } from 'lucide-react';
import api from '../api/axios'; // Khớp đúng đường dẫn axios của sếp

export default function PaymentReturn() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState<string>('Đang tiến hành xác minh giao dịch...');
    const [donationData, setDonationData] = useState<any>(null);

    useEffect(() => {
        const verifyDonation = async () => {
            try {
                // 1. Chuyển toàn bộ query params từ URL của VNPay thành object
                const paramsObj = Object.fromEntries(searchParams.entries());

                // 2. Bắn ngược params này lên endpoint verify của Backend để đối soát
                const response = await api.get('/payment/vnpay-return', { params: paramsObj });

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Cảm ơn tấm lòng vàng của sếp!');
                    setDonationData(response.data.data);
                } else {
                    setStatus('failed');
                    setMessage(response.data.message || 'Giao dịch không thành công hoặc đã bị hủy.');
                }
            } catch (error: any) {
                console.error('Lỗi xác minh thanh toán:', error);
                setStatus('failed');
                setMessage(error.response?.data?.error || 'Hệ thống không thể xác thực chữ ký giao dịch này.');
            }
        };

        verifyDonation();
    }, [searchParams]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/50 p-4 font-sans">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 max-w-md w-full shadow-sm text-center space-y-6">
                
                {/* 🔄 TRẠNG THÁI 1: ĐANG XỬ LÝ (LOADING) */}
                {status === 'loading' && (
                    <div className="py-8 space-y-4">
                        <div className="flex justify-center">
                            <Loader2 size={48} className="text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Đang xác thực dữ liệu</h2>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">{message}</p>
                    </div>
                )}

                {/* 🟢 TRẠNG THÁI 2: THANH TOÁN THÀNH CÔNG (SUCCESS) */}
                {status === 'success' && (
                    <div className="space-y-5 py-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                <CheckCircle2 size={36} className="text-emerald-500" />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-emerald-600 uppercase tracking-wider">Ủng hộ thành công!</h2>
                            <p className="text-xs text-slate-400 font-semibold">Hệ thống đã ghi nhận tấm lòng hảo tâm</p>
                        </div>

                        {/* Thẻ hiển thị biên lai tóm tắt số tiền */}
                        {donationData && (
                            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs sm:text-sm space-y-2">
                                <div className="flex justify-between border-b border-dashed pb-2 text-slate-400 font-bold uppercase text-[10px]">
                                    <span>Mã hóa đơn (TxnRef)</span>
                                    <span className="text-slate-700 font-black">{donationData.orderId}</span>
                                </div>
                                <div className="flex justify-between pt-1 font-semibold text-slate-600">
                                    <span>Số tiền đóng góp:</span>
                                    <span className="text-slate-900 font-black text-base text-emerald-600">
                                        +{donationData.amount?.toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] pt-1">
                                    <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
                                    <span>Tiền đã được cộng vào quỹ chiến dịch thời gian thực</span>
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-slate-500 leading-relaxed font-medium px-2">{message}</p>
                        
                        <div className="pt-2">
                            <Link to="/" className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm tracking-wide uppercase transition-all">
                                <span>Quay về trang chủ</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* 🔴 TRẠNG THÁI 3: THANH TOÁN THẤT BẠI (FAILED) */}
                {status === 'failed' && (
                    <div className="space-y-5 py-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-200">
                                <XCircle size={36} className="text-rose-500" />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-rose-600 uppercase tracking-wider">Giao dịch thất bại</h2>
                            <p className="text-xs text-slate-400 font-semibold">Quyên góp chưa hoàn tất</p>
                        </div>

                        <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                            <p className="text-xs font-semibold text-rose-700 leading-relaxed">{message}</p>
                        </div>

                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
                            Sếp có thể thử lại bằng thẻ test khác hoặc liên hệ Ban tổ chức nếu tài khoản ngân hàng thật lỡ bị trừ tiền nhé.
                        </p>
                        
                        <div className="pt-2 flex gap-3">
                            <Link to="/campaigns" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border font-bold text-xs text-slate-500 rounded-xl hover:bg-slate-50 transition-all">
                                Chọn chiến dịch khác
                            </Link>
                            <Link to="/" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-2sm">
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}