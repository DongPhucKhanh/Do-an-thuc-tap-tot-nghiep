import { useState } from 'react';
import { BookOpen, Scale, Award, AlertTriangle, HelpCircle, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export default function TrainingRegulations() {
  const [activeTab, setActiveTab] = useState<'chung' | 'khung-diem' | 'cong-tru' | 'phan-loai' | 'quy-trinh'>('chung');

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ================= HEADER TRANG CẨM NANG CÔNG PHU ================= */}
        <div
          className="bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-6"
          style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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
              Văn bản hợp nhất số: 145/QĐ-CĐCT
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Quy Định Đánh Giá Kết Quả Rèn Luyện
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Ban hành kèm theo Quyết định của Hiệu trưởng Trường Cao đẳng Công Thương TP.HCM áp dụng cho sinh viên hệ chính quy.
            </p>
          </div>
          <div
            className="shrink-0 text-center px-6 py-4"
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              minWidth: '110px',
            }}
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Thang điểm chuẩn</p>
            <p className="text-3xl font-bold text-blue-700">100đ</p>
          </div>
        </div>

        {/* ================= THÂN BỐ CỤC: SIDEBAR DI CHUYỂN + NỘI DUNG VĂN BẢN ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

          {/* MENU SIDEBAR BÊN TRÁI */}
          <div
            className="bg-white p-3 space-y-0.5"
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2" style={{ letterSpacing: '0.08em' }}>
              Mục lục tra cứu
            </p>

            {(
              [
                { key: 'chung', label: 'Quy định chung', icon: <BookOpen size={15} /> },
                { key: 'khung-diem', label: 'Khung điểm 4 mục', icon: <Scale size={15} /> },
                { key: 'cong-tru', label: 'Tiêu chí Cộng / Trừ', icon: <Award size={15} /> },
                { key: 'phan-loai', label: 'Phân loại kết quả', icon: <ShieldCheck size={15} /> },
                { key: 'quy-trinh', label: 'Quy trình xét duyệt', icon: <FileText size={15} /> },
              ] as const
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  borderRadius: '6px',
                  backgroundColor: activeTab === key ? '#1e40af' : 'transparent',
                  color: activeTab === key ? '#ffffff' : '#475569',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (activeTab !== key) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={e => {
                  if (activeTab !== key) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <span className="flex items-center gap-2.5">
                  {icon}
                  {label}
                </span>
                <ChevronRight size={13} style={{ opacity: activeTab === key ? 1 : 0.4 }} />
              </button>
            ))}
          </div>

          {/* NỘI DUNG VĂN BẢN CHI TIẾT BÊN PHẢI */}
          <div
            className="lg:col-span-3 bg-white p-6 sm:p-8 min-h-[500px]"
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >

            {/* TAB 1: QUY ĐỊNH CHUNG */}
            {activeTab === 'chung' && (
              <div className="space-y-6 text-slate-700">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 pb-3 mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    Chương I: Quy Định Chung
                  </h2>
                </div>

                {[
                  {
                    title: 'Điều 1. Phạm vi điều chỉnh và đối tượng áp dụng',
                    content: 'Quy định việc đánh giá kết quả rèn luyện của sinh viên hệ Cao đẳng chính quy đào tạo theo hệ thống tín chỉ tại trường Cao đẳng Công Thương TP.HCM, bao gồm các tiêu chí đánh giá, khung điểm, phân loại và quy trình xét duyệt.',
                  },
                  {
                    title: 'Điều 2. Mục đích đánh giá',
                    content: 'Nhằm góp phần thực hiện mục tiêu đào tạo con người phát triển toàn diện, có đạo đức nghề nghiệp, phẩm chất nhân cách và năng lực, trung thực, đáp ứng chuẩn đầu ra do Nhà trường quy định.',
                  },
                  {
                    title: 'Điều 3. Nguyên tắc thực hiện',
                    content: 'Bảo đảm khách quan, công khai, công bằng và chính xác; đảm bảo yếu tố bình đẳng, dân chủ, tôn trọng quyền làm chủ của sinh viên; phối hợp chặt chẽ giữa các Khoa, Phòng và Cố vấn học tập (CVHT).',
                  },
                ].map(({ title, content }) => (
                  <div
                    key={title}
                    className="p-4 space-y-1.5"
                    style={{
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="text-sm leading-relaxed text-slate-500">{content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: KHUNG ĐIỂM CHUẨN 4 MỤC */}
            {activeTab === 'khung-diem' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 pb-3 mb-1" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    Chương II: Tiêu Chí Đánh Giá Và Khung Điểm Chuẩn
                  </h2>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-3">
                    Điểm rèn luyện tổng hợp từ 4 nhóm chính (Thang điểm 100):
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: 'I. Ý thức tham gia học tập',
                      max: 'Tối đa 25đ',
                      color: '#2563eb',
                      bg: '#eff6ff',
                      desc: 'Được xác định dựa trên kết quả điểm học tập trung bình của học kỳ. Điểm học tập càng cao thì điểm rèn luyện mục này càng lớn (Xuất sắc nhận đủ 25đ, Giỏi nhận 20đ, Khá nhận 15đ, Trung bình nhận 10đ).',
                      border: '#3b82f6',
                    },
                    {
                      label: 'II. Chấp hành nội quy, quy chế',
                      max: 'Tối đa 25đ',
                      color: '#4f46e5',
                      bg: '#eef2ff',
                      desc: 'Đánh giá việc chấp hành tốt chủ trương của Đảng, pháp luật của Nhà nước hoặc địa phương; không vi phạm nội quy Khoa, Phòng, Ký túc xá, Thư viện; tham gia họp lớp đầy đủ; đóng học phí đúng hạn.',
                      border: '#6366f1',
                    },
                    {
                      label: 'III. Hoạt động Tình nguyện & CT-XH',
                      max: 'Tối đa 35đ',
                      color: '#059669',
                      bg: '#ecfdf5',
                      desc: 'Tham gia các cuộc thi do Đảng/Chính quyền phát động; tham gia hoạt động công ích, tình nguyện (Mùa hè xanh, hiến máu...); có ý thức giữ gìn an ninh trật tự, phòng chống tệ nạn; hỗ trợ phong trào Văn nghệ, TDTT.',
                      border: '#10b981',
                    },
                    {
                      label: 'IV. Phụ trách lớp & Đoàn thể',
                      max: 'Tối đa 15đ',
                      color: '#b45309',
                      bg: '#fffbeb',
                      desc: 'Dành cho cán bộ lớp (Lớp trưởng/Lớp phó), thành viên BCH Đoàn - Hội cấp Trường/Khoa/Chi đoàn, Ban chủ nhiệm Câu lạc bộ - Đội - Nhóm hoàn thành tốt hoặc xuất sắc nhiệm vụ được giao.',
                      border: '#f59e0b',
                    },
                  ].map(({ label, max, color, bg, desc, border }) => (
                    <div
                      key={label}
                      className="p-4 space-y-2"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderLeft: `4px solid ${border}`,
                      }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold" style={{ color }}>{label}</p>
                        <span
                          className="text-xs font-medium shrink-0 px-2 py-0.5"
                          style={{ backgroundColor: bg, color, borderRadius: '4px' }}
                        >
                          {max}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TIÊU CHÍ CỘNG VÀ TRỪ */}
            {activeTab === 'cong-tru' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    Điều 9 & 10: Tiêu Chí Điểm Cộng Và Điểm Trừ
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* DANH SÁCH ĐIỂM CỘNG */}
                  <div style={{ borderRadius: '6px', border: '1px solid #e9d5ff', overflow: 'hidden' }}>
                    <div
                      className="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold"
                      style={{ backgroundColor: '#f5f3ff', color: '#6d28d9', borderBottom: '1px solid #e9d5ff' }}
                    >
                      <Award size={15} />
                      Tiêu chí được CỘNG ĐIỂM (Tối đa cộng 20đ)
                    </div>
                    <ul className="p-4 text-sm text-slate-600 space-y-2.5 list-disc list-inside" style={{ backgroundColor: '#fafafa' }}>
                      <li>Đạt giải thưởng các cuộc thi do Đảng, Chính quyền, Đoàn thể phát động (Cấp trường: +10đ, Cấp tỉnh: +15đ, Toàn quốc: +20đ).</li>
                      <li>Tham gia nghiên cứu khoa học, dự án khởi nghiệp được nghiệm thu từ đạt trở lên (+10đ đến +20đ tùy cấp).</li>
                      <li>Tham gia hội thi tay nghề đạt giải; có sáng kiến, bài báo được đăng tải trên các tạp chí khoa học chuyên ngành (+15đ).</li>
                      <li>Tham gia các chương trình giao lưu, trao đổi sinh viên quốc tế (+10đ).</li>
                    </ul>
                  </div>

                  {/* DANH SÁCH ĐIỂM TRỪ */}
                  <div style={{ borderRadius: '6px', border: '1px solid #fecaca', overflow: 'hidden' }}>
                    <div
                      className="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold"
                      style={{ backgroundColor: '#fff1f2', color: '#b91c1c', borderBottom: '1px solid #fecaca' }}
                    >
                      <AlertTriangle size={15} />
                      Tiêu chí bị TRỪ ĐIỂM (Trừ từ 5đ đến 15đ mỗi hành vi)
                    </div>
                    <ul className="p-4 text-sm text-slate-600 space-y-2.5 list-disc list-inside" style={{ backgroundColor: '#fafafa' }}>
                      <li>Vi phạm pháp luật, quy định địa phương có giấy báo gửi về Nhà trường (<b className="text-rose-600">-10đ</b>).</li>
                      <li>Vắng học Tuần sinh hoạt công dân đầu khóa hoặc bài thu hoạch không đạt yêu cầu (<b className="text-rose-600">-5đ</b>).</li>
                      <li>Vắng các buổi họp lớp, họp Khoa do CVHT tổ chức không có lý do (<b className="text-rose-600">-5đ/buổi</b>, có lý do trừ 2đ).</li>
                      <li>Không tham gia khám sức khỏe đầu khóa, không tham gia các đợt khảo sát bắt buộc của Trường (<b className="text-rose-600">-5đ</b>).</li>
                      <li>Bị ghi nhận hút thuốc lá, nói tục, chửi thề trong khuôn viên Trường hoặc không mặc đồng phục quy định (<b className="text-rose-600">-5đ</b>).</li>
                      <li>Phát ngôn không chuẩn mực, vi phạm Luật An ninh mạng trên không gian mạng xã hội (<b className="text-rose-600">-10đ</b>).</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PHÂN LOẠI KẾT QUẢ VÀ KỶ LUẬT */}
            {activeTab === 'phan-loai' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    Điều 11 & 12: Phân Loại Xếp Loại Rèn Luyện
                  </h2>
                </div>

                {/* Khung xếp loại */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Khung điểm đạt được</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Xếp loại tương ứng</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sử dụng kết quả (Điều 16)</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600" style={{ fontSize: '13px' }}>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#b45309' }}>Từ 90 đến 100 điểm</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#f59e0b' }}></span>
                            Loại Xuất Sắc
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 font-medium" rowSpan={3}>
                          Dùng làm căn cứ xét cấp học bổng khuyến khích học tập, xét khen thưởng danh hiệu, xét ưu tiên ở KTX và là điều kiện bắt buộc để xét công nhận tốt nghiệp ra trường.
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#059669' }}>Từ 80 đến dưới 90 điểm</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#10b981' }}></span>
                            Loại Tốt
                          </span>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#2563eb' }}>Từ 70 đến dưới 80 điểm</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#3b82f6' }}></span>
                            Loại Khá
                          </span>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#ea580c' }}>Từ 50 đến dưới 70 điểm</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#f97316' }}></span>
                            Loại Trung Bình
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 font-medium">Được tốt nghiệp nhưng không xét học bổng.</td>
                      </tr>
                      <tr style={{ backgroundColor: '#fff1f2' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#dc2626' }}>Dưới 50 điểm</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#ef4444' }}></span>
                            Loại Chưa Đạt (Yếu/Kém)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: '#dc2626' }}>
                          Bị xếp loại Yếu/Kém 2 học kỳ liên tiếp → Tạm ngừng học 1 kỳ. Tái phạm lần 2 → Buộc thôi học.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Lưu ý khi bị kỷ luật */}
                <div
                  className="p-4 space-y-2 text-sm"
                  style={{
                    borderRadius: '6px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                  }}
                >
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    Lưu ý đặc biệt đối với sinh viên bị kỷ luật (Điều 12):
                  </p>
                  <p className="pl-5 text-xs leading-relaxed">• Sinh viên bị khiển trách cấp Trường học kỳ đó: Kết quả rèn luyện <b className="font-semibold text-slate-800">không được vượt quá loại Khá</b>.</p>
                  <p className="pl-5 text-xs leading-relaxed">• Sinh viên bị cảnh cáo cấp Trường học kỳ đó: Kết quả rèn luyện <b className="font-semibold text-slate-800">không được vượt quá loại Trung bình</b>.</p>
                  <p className="pl-5 text-xs leading-relaxed">• Sinh viên bị đình chỉ học tập có thời hạn: Không thực hiện đánh giá rèn luyện trong thời gian bị đình chỉ.</p>
                </div>
              </div>
            )}

            {/* TAB 5: QUY TRÌNH XÉT DUYỆT ONLINE */}
            {activeTab === 'quy-trinh' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    Điều 13: Quy Trình Đánh Giá 4 Bậc
                  </h2>
                </div>

                {/* Flow timeline dọc */}
                <div className="space-y-4 pl-4 relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-slate-200">

                  {[
                    {
                      step: 'Bước 1: Sinh viên tự chấm (Online)',
                      color: '#2563eb',
                      dot: '#2563eb',
                      content: 'Cá nhân sinh viên tự đăng nhập hệ thống, tự điền điểm theo minh chứng học kỳ.',
                      note: '* Lưu ý: Sinh viên không tự đánh giá đúng thời gian quy định sẽ bị tính 0 điểm rèn luyện!',
                    },
                    {
                      step: 'Bước 2: Họp Lớp & Cố vấn chấm điểm',
                      color: '#4f46e5',
                      dot: '#4f46e5',
                      content: 'Ban cán sự lớp phối hợp cùng Cố vấn học tập (CVHT) tổ chức họp xét, duyệt biên bản, CVHT chấm điểm chính thức cho sinh viên trên phần mềm giảng viên.',
                      note: null,
                    },
                    {
                      step: 'Bước 3: Hội đồng đánh giá Cấp Khoa',
                      color: '#7c3aed',
                      dot: '#7c3aed',
                      content: 'Hội đồng cấp Khoa tiếp nhận biên bản từ CVHT, tổ chức kiểm tra rà soát chéo rồi duyệt bảng điểm chuyển lên Phòng Công tác HSSV.',
                      note: null,
                    },
                    {
                      step: 'Bước 4: Hội đồng Trường & Quyết định chính thức',
                      color: '#059669',
                      dot: '#059669',
                      content: 'Hội đồng cấp Trường thẩm định, công bố công khai bảng điểm dự kiến trước sinh viên 20 ngày trước khi Hiệu trưởng ký quyết định ban hành chính thức.',
                      note: null,
                    },
                  ].map(({ step, color, dot, content, note }) => (
                    <div key={step} className="relative pl-6 space-y-1">
                      <div
                        className="absolute top-1 left-0 w-4 h-4 rounded-full border-4 border-white"
                        style={{ backgroundColor: dot, boxShadow: '0 0 0 2px #e2e8f0' }}
                      ></div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color, letterSpacing: '0.06em' }}>{step}</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
                      {note && (
                        <p className="text-xs italic font-medium" style={{ color: '#e11d48' }}>{note}</p>
                      )}
                    </div>
                  ))}

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}