import { useState, useEffect } from 'react';
import { ShieldCheck, Award, AlertTriangle, FileSpreadsheet, Send, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function TrainingPoint() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Thống tin học kỳ
  const [semester, setSemester] = useState('Học kỳ I');
  const [academicYear, setAcademicYear] = useState('2025-2026');

  // State lưu trữ điểm số sinh viên chọn nhập
  const [scoreI, setScoreI] = useState(0);
  const [scoreII, setScoreII] = useState(0);
  const [scoreIII, setScoreIII] = useState(0);
  const [scoreIV, setScoreIV] = useState(0);
  const [scoreBonus, setScoreBonus] = useState(0);
  const [scorePenalty, setScorePenalty] = useState(0);

  const [totalScore, setTotalScore] = useState(0);
  const [classification, setClassification] = useState('Chưa đạt');
  const [submitting, setSubmitting] = useState(false);

  // Tự động tính toán tổng điểm và phân loại mỗi khi có mục thay đổi điểm
  useEffect(() => {
    let total = (scoreI + scoreII + scoreIII + scoreIV) + scoreBonus - scorePenalty;
    if (total > 100) total = 100;
    if (total < 0) total = 0;
    setTotalScore(total);

    if (total >= 90) setClassification('Xuất sắc');
    else if (total >= 80) setClassification('Tốt');
    else if (total >= 70) setClassification('Khá');
    else if (total >= 50) setClassification('Trung bình');
    else setClassification('Chưa đạt');
  }, [scoreI, scoreII, scoreIII, scoreIV, scoreBonus, scorePenalty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.id) return alert('Vui lòng đăng nhập hệ thống!');

    setSubmitting(true);
    try {
      await api.post('/point-evaluations', {
        semester, academicYear, scoreI, scoreII, scoreIII, scoreIV, scoreBonus, scorePenalty,
        userId: currentUser.id
      });
      alert('🎉 Đã nộp phiếu tự đánh giá rèn luyện trực tuyến thành công lên hệ thống của Trường!');
    } catch (error) {
      console.error(error);
      alert('Lỗi nộp phiếu điểm.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        
        
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-center text-white space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Hệ Thống Quản Lý Sinh Viên Trực Tuyến</p>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase">Phiếu Tự Đánh Giá Kết Quả Rèn Luyện</h1>
          <div className="flex items-center justify-center gap-4 pt-2 text-xs font-semibold">
            <label className="flex items-center gap-1.5">
              <span>Học kỳ:</span>
              <select value={semester} onChange={e => setSemester(e.target.value)} className="bg-white/10 border border-white/20 px-2 py-1 rounded text-white focus:outline-none focus:bg-slate-800">
                <option value="Học kỳ I" className="text-slate-800">Học kỳ I</option>
                <option value="Học kỳ II" className="text-slate-800">Học kỳ II</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5">
              <span>Năm học:</span>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="bg-white/10 border border-white/20 px-2 py-1 rounded text-white focus:outline-none focus:bg-slate-800">
                <option value="2025-2026" className="text-slate-800">2025-2026</option>
                <option value="2026-2027" className="text-slate-800">2026-2027</option>
              </select>
            </label>
          </div>
        </div>

        
        <div className="p-5 bg-slate-50 border-b flex flex-wrap gap-6 text-xs sm:text-sm font-bold text-slate-700">
          <p>👤 Sinh viên: <span className="text-blue-600">{currentUser.fullName || 'Chưa cập nhật'}</span></p>
          <p>🆔 Mã số SV: <span className="text-slate-900">{currentUser.studentCode || 'N/A'}</span></p>
          <p>🏫 Đơn vị: <span className="text-slate-500">Hệ Cao đẳng Chính quy</span></p>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6 space-y-8 divide-y divide-slate-100">
          
          
          <div className="space-y-4 pt-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-black">I</span>
              Đánh giá về ý thức tham gia học tập (Tối đa 25 điểm)
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                <p className="font-bold text-slate-800">Chọn mức xếp loại kết quả học tập của bạn học kỳ này:</p>
                <p className="text-[11px] mt-0.5 text-slate-400">Xuất sắc (≥9.0): 25đ | Giỏi (8.0-9.0): 20đ | Khá (6.25-8.0): 15đ | TB (5.0-6.25): 10đ</p>
              </div>
              <select onChange={e => setScoreI(parseInt(e.target.value))} className="px-3 py-2 text-xs sm:text-sm bg-white border rounded-xl font-bold text-slate-700 focus:border-blue-500 outline-none">
                <option value="0">-- Chọn kết quả học tập --</option>
                <option value="25">Điểm học tập Loại Xuất sắc (25 điểm)</option>
                <option value="20">Điểm học tập Loại Giỏi (20 điểm)</option>
                <option value="15">Điểm học tập Loại Khá (15 điểm)</option>
                <option value="10">Điểm học tập Loại Trung bình (10 điểm)</option>
                <option value="0">Điểm học tập Loại Yếu / Kém (0 điểm)</option>
              </select>
            </div>
          </div>

          
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-black">II</span>
              Ý thức chấp hành nội quy, quy chế nhà trường (Tối đa 25 điểm)
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tự chấm điểm ý thức trách nhiệm nội bộ:</p>
              <div className="flex items-center justify-between gap-4 bg-white p-2.5 rounded-xl border border-slate-100 text-xs sm:text-sm">
                <span className="text-slate-600 font-medium">Chấp hành tốt pháp luật, đóng BHYT, đi họp lớp đầy đủ, đóng học phí đúng hạn?</span>
                <input type="number" min="0" max="25" placeholder="Nhập từ 0 - 25" value={scoreII || ''} onChange={e => setScoreII(Math.min(25, parseInt(e.target.value) || 0))} className="w-24 px-3 py-1 bg-slate-50 border rounded-lg font-bold text-center text-slate-800 outline-none focus:bg-white focus:border-blue-500" />
              </div>
            </div>
          </div>

          
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">III</span>
              Tham gia hoạt động CT-XH, Tình nguyện, Văn thể mỹ (Tối đa 35 điểm)
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ghi nhận công tác tình nguyện xã hội:</p>
              <div className="flex items-center justify-between gap-4 bg-white p-2.5 rounded-xl border border-slate-100 text-xs sm:text-sm">
                <span className="text-slate-600 font-medium">Tham gia cuộc thi, hoạt động công ích, hiến máu, chiến dịch xanh, văn nghệ cổ động...</span>
                <input type="number" min="0" max="35" placeholder="Nhập từ 0 - 35" value={scoreIII || ''} onChange={e => setScoreIII(Math.min(35, parseInt(e.target.value) || 0))} className="w-24 px-3 py-1 bg-slate-50 border rounded-lg font-bold text-center text-slate-800 outline-none focus:bg-white focus:border-blue-500" />
              </div>
            </div>
          </div>

          
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-black">IV</span>
              Ý thức tham gia công tác phụ trách lớp, Đoàn - Hội (Tối đa 15 điểm)
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                <p className="font-bold text-slate-800">Chọn chức vụ hoàn thành nhiệm vụ cao nhất của bạn:</p>
                <p className="text-[11px] mt-0.5 text-slate-400">BCH Đoàn - Hội Trường/Khoa, Lớp trưởng, Sinh viên 5 Tốt, Cán bộ tiêu biểu...</p>
              </div>
              <select onChange={e => setScoreIV(parseInt(e.target.value))} className="px-3 py-2 text-xs sm:text-sm bg-white border rounded-xl font-bold text-slate-700 focus:border-blue-500 outline-none">
                <option value="0">Không giữ chức vụ (0 điểm)</option>
                <option value="15">Cán bộ xuất sắc / Sinh viên 5 tốt cấp trường (15 điểm)</option>
                <option value="10">Cán bộ hoàn thành tốt nhiệm vụ / Cán bộ cấp khoa (10 điểm)</option>
                <option value="5">Cán bộ hoàn thành nhiệm vụ cấp chi đoàn/lớp (5 điểm)</option>
              </select>
            </div>
          </div>

          
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-purple-700 flex items-center gap-2">
              <Award size="{20}" className="text-purple-600"/>
              V. Tiêu chí điểm cộng đặc biệt ngoài khung (Thêm tối đa 20 điểm)
            </h3>
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between gap-4 text-xs sm:text-sm">
              <span className="text-purple-900 font-medium">Đạt giải cuộc thi các cấp, Nghiên cứu khoa học, dự án khởi nghiệp được duyệt, thi tay nghề...</span>
              <input type="number" min="0" max="20" placeholder="0 - 20" value={scoreBonus || ''} onChange={e => setScoreBonus(Math.min(20, parseInt(e.target.value) || 0))} className="w-24 px-3 py-1 bg-white border border-purple-200 rounded-lg font-bold text-center text-purple-700 outline-none focus:border-purple-500" />
            </div>
          </div>

          
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle size="{20}" className="text-rose-600"/>
              VI. Tiêu chí điểm trừ vi phạm quy định (Trừ thẳng vào tổng điểm)
            </h3>
            <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 flex items-center justify-between gap-4 text-xs sm:text-sm">
              <span className="text-rose-900 font-medium">Bỏ SHCD, không đi khám sức khỏe, hút thuốc, phát ngôn sai lệch mạng xã hội, không mặc đồng phục...</span>
              <input type="number" min="0" placeholder="Nhập số điểm" value={scorePenalty || ''} onChange={e => setScorePenalty(parseInt(e.target.value) || 0)} className="w-24 px-3 py-1 bg-white border border-rose-200 rounded-lg font-bold text-center text-rose-700 outline-none focus:border-rose-500" />
            </div>
          </div>

          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 p-6 rounded-b-none rounded-t-3xl text-white">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng điểm hiện tại</p>
                <p className="text-3xl font-black text-blue-400 mt-0.5">{totalScore} <span className="text-xs text-white">/ 100</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dự kiến xếp loại</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  classification === 'Xuất sắc' ? 'bg-amber-500 text-slate-950' :
                  classification === 'Tốt' ? 'bg-emerald-500 text-white' :
                  classification === 'Khá' ? 'bg-blue-500 text-white' :
                  classification === 'Trung bình' ? 'bg-orange-500 text-white' : 'bg-rose-500 text-white'
                }`}>{classification}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-95">
              {submitting ? <Loader2 size="{16}" className="animate-spin"/> : <Send size="{16}"/>}
              Nộp Phiếu Điểm Trực Tuyến
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}