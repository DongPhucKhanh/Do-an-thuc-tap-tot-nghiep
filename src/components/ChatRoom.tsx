import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../api/axios';
import { Send, User as UserIcon } from 'lucide-react';

interface ChatRoomProps {
    campaignId: number;
}

export default function ChatRoom({ campaignId }: ChatRoomProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // 1. Fetch tin nhắn cũ
        api.get(`/campaigns/${campaignId}/messages`)
            .then(res => setMessages(res.data.data))
            .catch(console.error);

        // 2. Kết nối Socket
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_campaign', campaignId);

        socketRef.current.on('receive_message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [campaignId]);

    // Cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        socketRef.current?.emit('send_message', {
            campaignId,
            senderId: user.id,
            content: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 text-white">
                <h3 className="font-bold text-sm">💬 Thảo luận Chiến dịch</h3>
                <p className="text-xs text-blue-100">Trao đổi nội bộ dành cho tình nguyện viên</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm mt-10">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={index} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                        {msg.sender?.avatar ? (
                                            <img src={`http://localhost:5000${msg.sender.avatar}`} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon size={16} className="text-slate-500" />
                                        )}
                                    </div>
                                )}
                                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!isMe && <span className="text-[11px] text-slate-500 ml-1 mb-0.5">{msg.sender?.fullName}</span>}
                                    <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'}`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-slate-100 dark:bg-slate-900 dark:text-white px-4 py-2 rounded-full outline-none text-sm border-transparent focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white disabled:opacity-50 transition-colors">
                    <Send size={18} className="-ml-0.5" />
                </button>
            </form>
        </div>
    );
}
