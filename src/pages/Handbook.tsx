import { useState } from 'react';
import { Compass, Sparkles, Smartphone, HelpCircle, CheckCircle2, ChevronDown, Award, Flame, ThumbsUp, MessageSquare } from 'lucide-react';

export default function Handbook() {
  // State quản lý đóng mở các câu hỏi thường gặp (FAQ Accordion)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Điểm rèn luyện học kỳ này của em có được tự động cộng từ hoạt động tình nguyện không?",
      a: "Có! Hệ thống mạng xã hội dấu ấn tình nguyện này liên kết trực tiếp với database. Khi bạn đăng ký tham gia và hoàn thành một chiến dịch (như Mùa Hè Xanh, Xuân Tình Nguyện), minh chứng sẽ được lưu lại để Cố vấn học tập (CVHT) lấy làm căn cứ cộng tối đa 35 điểm ở Mục III."
    },
    {
      q: "Em quên không làm khảo sát hoặc nộp phiếu tự chấm đúng hạn thì có sao không?",
      a: "Theo Điều 13 của quy chế, nếu sinh viên không thực hiện tự đánh giá online đúng thời gian quy định của Nhà trường, điểm rèn luyện của học kỳ đó sẽ mặc định bị tính là 0 điểm!"
    },
    {
      q: "Nếu em bị kỷ luật Khiển trách hoặc Cảnh cáo thì điểm rèn luyện bị ảnh hưởng thế nào?",
      a: "Cực kỳ nghiêm trọng sếp nhé! Theo Điều 12, nếu bị Khiển trách cấp Trường, điểm rèn luyện học kỳ đó KHÔNG ĐƯỢC VƯỢT QUÁ loại Khá (dưới 80đ). Nếu bị Cảnh cáo, điểm rèn luyện KHÔNG ĐƯỢC VƯỢT QUÁ loại Trung bình (dưới 70đ), mất toàn bộ cơ hội xét học bổng."
    },
    {
      q: "Làm sao để được cộng 20 điểm thưởng ở Mục V ngoài khung?",
      a: "Hãy tích cực tham gia các hội thi tay nghề, đạt giải thưởng văn nghệ/thể thao cấp Trường trở lên, hoặc tham gia viết đề tài Nghiên cứu khoa học, dự án khởi nghiệp được nghiệm thu đạt trở lên."
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ================= HEADER CẨM NANG TRẺ TRUNG ================= */}
        <div
          className="bg-white p-6 sm:p-8"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #2563eb',
          }}
        >
          <div className="space-y-2">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1"
              style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: '4px',
                letterSpacing: '0.06em',
              }}
            >
              Sổ tay điện tử sinh viên
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Cẩm Nang Hướng Dẫn &amp; Mẹo Tích Điểm
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              Bí kíp làm chủ ứng dụng và lộ trình đạt điểm rèn luyện Xuất sắc dành riêng cho chiến sĩ tình nguyện Cao đẳng Công Thương.
            </p>
          </div>
        </div>

        {/* ================= PHẦN 1: BÍ KÍP "HACK" ĐIỂM RÈN LUYỆN XUẤT SẮC ================= */}
        <div
          className="bg-white p-6 sm:p-8 space-y-5"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div>
            <h2
              className="text-base font-semibold text-slate-800 pb-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #e2e8f0' }}
            >
              <Flame className="text-orange-500 shrink-0" size={17} />
              Lộ trình 3 bước đạt Điểm rèn luyện Loại Xuất Sắc (≥ 90đ)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bước 1 */}
            <div
              className="p-4 space-y-2"
              style={{
                borderRadius: '6px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5"
                  style={{ backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '4px' }}
                >
                  Bước 01
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">Giữ vững phong độ học tập</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cố gắng giữ điểm GPA học tập học kỳ từ <b className="text-blue-600">6.25 trở lên</b> để bỏ túi chắc chắn từ 15đ đến 25đ ở Mục I ngay từ vạch xuất phát.
              </p>
            </div>

            {/* Bước 2 */}
            <div
              className="p-4 space-y-2"
              style={{
                borderRadius: '6px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #6366f1',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5"
                  style={{ backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '4px' }}
                >
                  Bước 02
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">"Quét sạch" 25đ nội quy</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đóng học phí đúng hạn, tham gia đầy đủ các buổi sinh hoạt lớp/Khoa do CVHT triệu tập. Nhớ mặc đồng phục quy định để không bị trừ 5đ oan uổng!
              </p>
            </div>

            {/* Bước 3 */}
            <div
              className="p-4 space-y-2"
              style={{
                borderRadius: '6px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #10b981',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5"
                  style={{ backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '4px' }}
                >
                  Bước 03
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">Bùng nổ hoạt động app</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bấm đăng ký tham gia các chiến dịch tình nguyện trên app. Đi hoạt động về nhớ đăng bài viết, clip ngắn lên Bảng tin để nhận trọn vẹn <b className="text-emerald-600">35đ Mục III</b>.
              </p>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: HƯỚNG DẪN SỬ DỤNG TÍNH NĂNG APP ================= */}
        <div
          className="bg-white p-6 sm:p-8 space-y-5"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div>
            <h2
              className="text-base font-semibold text-slate-800 pb-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #e2e8f0' }}
            >
              <Smartphone className="text-blue-600 shrink-0" size={17} />
              Hướng dẫn thao tác trên Mạng xã hội Tình nguyện
            </h2>
          </div>

          <div className="space-y-3">
            {/* Thao tác 1 */}
            <div
              className="flex gap-4 items-start p-4"
              style={{
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                className="p-2 shrink-0"
                style={{ backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '6px' }}
              >
                <Compass size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">1. Cách đăng chia sẻ Nhật ký &amp; Album đa phương tiện</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tại trang Bảng tin, nhấn vào ô <b className="text-slate-700">"Bạn đang nghĩ gì?"</b>. Nhập tiêu đề, nội dung nhật ký, chọn địa điểm và gắn thẻ tên Chiến dịch tình nguyện liên quan. Hệ thống hỗ trợ tải lên cùng lúc nhiều hình ảnh và video video ngắn để tự động tạo lưới Album ảnh như mạng xã hội thực tế.
                </p>
              </div>
            </div>

            {/* Thao tác 2 */}
            <div
              className="flex gap-4 items-start p-4"
              style={{
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                className="p-2 shrink-0"
                style={{ backgroundColor: '#d1fae5', color: '#059669', borderRadius: '6px' }}
              >
                <ThumbsUp size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">2. Tương tác Thả tim &amp; Bình luận trực tiếp (Inline Comment)</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sinh viên có thể xem toàn bộ bài viết của bạn bè khác trên dòng thời gian chung. Bấm <b className="text-blue-600">Thích</b> để tăng tương tác thật lưu xuống MySQL, hoặc bấm <b className="text-blue-600">Bình luận</b> để mở hộp thoại gõ tin nhắn thảo luận trực tiếp ngay dưới bức ảnh mà không cần chuyển màn hình.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 3: CÂU HỎI THƯỜNG GẶP (FAQs ACCORDION) ================= */}
        <div
          className="bg-white p-6 sm:p-8 space-y-4"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div>
            <h2
              className="text-base font-semibold text-slate-800 pb-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid #e2e8f0' }}
            >
              <HelpCircle className="text-purple-600 shrink-0" size={17} />
              Giải đáp thắc mắc thường gặp của Sinh viên
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    borderRadius: '6px',
                    border: isOpen ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  {/* Nút bấm tiêu đề câu hỏi */}
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isOpen ? '#eff6ff' : '#f8fafc',
                      color: isOpen ? '#1d4ed8' : '#475569',
                      borderLeft: isOpen ? '3px solid #2563eb' : '3px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isOpen) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      if (!isOpen) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 ml-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      style={{ color: isOpen ? '#2563eb' : '#94a3b8' }}
                    />
                  </button>

                  {/* Khối hiển thị câu trả lời trượt mở */}
                  {isOpen && (
                    <div
                      className="px-4 py-3 text-sm text-slate-600 leading-relaxed"
                      style={{ backgroundColor: '#ffffff', borderTop: '1px solid #dbeafe' }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}