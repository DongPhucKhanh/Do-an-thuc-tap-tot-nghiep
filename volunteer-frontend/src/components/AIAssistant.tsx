import { useState } from 'react';
import api from '../config/axios';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([
        { role: 'ai', text: 'Xin chào Bí thư! Tôi là Trợ lý AI Hệ thống. Tôi có thể giúp gì báo cáo số liệu gì cho bạn hôm nay?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!question.trim()) return;
        
        // Thêm câu hỏi của user vào UI
        const newHistory = [...chatHistory, { role: 'user', text: question }];
        setChatHistory(newHistory);
        setQuestion('');
        setIsLoading(true);

        try {
            // Gọi API Backend
            const res = await api.post('/ai/ask', { question });
            setChatHistory([...newHistory, { role: 'ai', text: res.data.answer }]);
        } catch (error) {
            setChatHistory([...newHistory, { role: 'ai', text: 'Xin lỗi, hệ thống AI đang bảo trì hoặc mất kết nối.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            {/* Nút bấm mở Chatbot */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0984e3', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(9, 132, 227, 0.4)' }}
                >
                    <Bot size={32} />
                </button>
            )}

            {/* Khung Chat */}
            {isOpen && (
                <div style={{ width: '350px', height: '500px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ backgroundColor: '#0984e3', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                            <Sparkles size={20} /> Trợ lý AI Bí thư
                        </div>
                        <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Lịch sử Chat */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f8f9fa' }}>
                        {chatHistory.map((chat, index) => (
                            <div key={index} style={{ alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                <div style={{ backgroundColor: chat.role === 'user' ? '#0984e3' : '#e1f2f6', color: chat.role === 'user' ? 'white' : '#2d3436', padding: '10px 15px', borderRadius: chat.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0', fontSize: '14px', lineHeight: '1.5' }}>
                                    {chat.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div style={{ alignSelf: 'flex-start', fontSize: '13px', color: '#636e72' }}>AI đang suy nghĩ...</div>}
                    </div>

                    {/* Ô nhập liệu */}
                    <div style={{ padding: '15px', backgroundColor: 'white', borderTop: '1px solid #dfe6e9', display: 'flex', gap: '10px' }}>
                        <input 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Hỏi về số liệu chiến dịch..."
                            style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #dfe6e9', outline: 'none' }}
                        />
                        <button onClick={handleSend} style={{ backgroundColor: '#0984e3', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}