import { useState, useEffect } from 'react';
import { MapPin, Navigation, Calendar, Loader2, Compass, ArrowRight } from 'lucide-react';
import api from '../api/axios';

export default function NearestCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Lấy dữ liệu tài khoản đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchNearest = async () => {
      if (!currentUser.id) {
        setErrorMsg('Vui lòng đăng nhập hệ thống để sử dụng tính năng quét vị trí gần nhất!');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/campaigns/nearest/${currentUser.id}`);
        setCampaigns(response.data.data);
        setUserAddress(response.data.userAddress || 'Vị trí đã lưu');
        setErrorMsg('');
      } catch (error: any) {
        console.error(error);
        setErrorMsg(error.response?.data?.error || 'Không thể tính toán khoảng cách địa lý.');
      } finally {
        setLoading(false);
      }
    };

    fetchNearest();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-3">
        <Loader2 size="{32}" className="animate-spin text-blue-600"/>
        <p className="text-sm font-semibold text-slate-600">Đang quét định vị và tính khoảng cách thực tế...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white border p-6 rounded-2xl text-center shadow-sm space-y-3">
        <MapPin size="{40}" className="text-rose-500 mx-auto animate-bounce"/>
        <h3 className="font-bold text-slate-900 text-base">Thiếu Thông Tin Vị Trí</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{errorMsg}</p>
        <p className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-xl font-bold">
          💡 Mẹo: Hãy vào phần Cập nhật thông tin tài khoản, lưu địa chỉ kèm tọa độ nơi ở hiện tại để kích hoạt tính năng này!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Compass className="text-blue-600 animate-spin-slow" size="{22}"/>
              Chiến Dịch Tình Nguyện Gần Bạn Nhất
            </h2>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              📍 Nơi ở hiện tại của bạn: <span className="text-blue-600 hover:underline">{userAddress}</span>
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold shrink-0 self-start sm:self-center">
            🚀 Hệ thống tự động sắp xếp theo km gần nhất
          </span>
        </div>

        
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="bg-white text-center py-12 text-slate-400 text-sm rounded-2xl border">
              Hiện tại chưa có dữ liệu chiến dịch nào có tọa độ định vị thực tế.
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
                
                
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-lg shadow-sm">
                      <Navigation size="{12}" className="fill-current"/>
                      Cách bạn {campaign.distanceKm} km
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Mã hoạt động: #CAMP-{campaign.id}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
                      <MapPin size="{13}" className="text-slate-400"/>
                      Điểm diễn ra: {campaign.location}
                    </p>
                  </div>
                </div>

                
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                  <div className="text-left md:text-right font-semibold text-xs text-slate-400 space-y-0.5">
                    <p className="uppercase text-[10px] tracking-wider text-slate-400 font-bold flex items-center md:justify-end gap-1">
                      <Calendar size="{12}"/> Thời gian mở cửa
                    </p>
                    <p className="text-slate-700 font-bold">{new Date(campaign.startDate || campaign.date || Date.now()).toLocaleDateString('vi-VN')}</p>
                  </div>

                  <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all group-hover:translate-x-1">
                    Xem & Đăng ký <ArrowRight size="{14}"/>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}