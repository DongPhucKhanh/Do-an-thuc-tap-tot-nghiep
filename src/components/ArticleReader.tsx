import { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';

interface ArticleReaderProps {
  title: string;
  content: string;
}

const ArticleReader = ({ title, content }: ArticleReaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Kiểm tra trình duyệt có hỗ trợ Web Speech API không
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    
    // Cleanup: Tự động tắt giọng đọc nếu user chuyển sang trang khác
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleRead = () => {
    if (!isSupported) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.");
      return;
    }

    if (isPlaying) {
      // Nếu đang đọc thì bấm nút sẽ Dừng lại
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // 1. Lọc bỏ toàn bộ các thẻ HTML (VD: <p>, <strong>, <br>) để AI đọc không bị vấp
      const cleanContent = content.replace(/<[^>]+>/g, ' ');
      
      // 2. Ghép tiêu đề và nội dung
      const textToRead = `${title}. ${cleanContent}`;
      
      // 3. Khởi tạo bộ đọc
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Cấu hình giọng đọc (Tiếng Việt)
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95; // Tốc độ đọc (nhỏ hơn 1 một chút cho truyền cảm)
      utterance.pitch = 1;   // Độ cao giọng
      
      // Bắt sự kiện khi đọc xong thì tự đổi trạng thái nút về ban đầu
      utterance.onend = () => setIsPlaying(false);
      // Bắt sự kiện nếu bị lỗi (bị ngắt ngang)
      utterance.onerror = () => setIsPlaying(false);

      // Bắt đầu đọc
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Nếu trình duyệt cũ quá không hỗ trợ thì ẩn luôn nút này đi
  if (!isSupported) return null;

  return (
    <button
      onClick={toggleRead}
      className={`inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full text-sm font-semibold transition-all duration-300 ${
        isPlaying 
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm hover:shadow-md' 
          : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 shadow-sm hover:shadow-md'
      }`}
    >
      {isPlaying ? (
        <>
          <Square size={16} className="fill-current" />
          <span>Dừng nghe bài viết</span>
        </>
      ) : (
        <>
          <Volume2 size={16} />
          <span>Nghe bài viết</span>
        </>
      )}
    </button>
  );
};

export default ArticleReader;