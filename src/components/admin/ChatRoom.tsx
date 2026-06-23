import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../../config/axios';
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

        api.get(`/campaigns/${campaignId}/messages`)
            .then(res => setMessages(res.data.data))
            .catch(console.error);

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_campaign', campaignId);

        socketRef.current.on('receive_message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [campaignId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        socketRef.current?.emit('send_message', {
            campaignId,
            senderId: user.id, // Admin id
            content: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-sm">💬 Thảo luận Chiến dịch (Admin View)</h3>
                    <p className="text-xs text-slate-300">Nhắn tin trực tiếp với các tình nguyện viên</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm mt-10">Chưa có tin nhắn nào.</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={index} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                                    {!isMe && <span className="text-xs font-semibold text-slate-600 ml-1 mb-1">{msg.sender?.fullName}</span>}
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 rounded-bl-none text-slate-800'}`}>
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

            <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2" style={{ borderColor: '#e2e8f0' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập thông báo từ Admin..."
                    className="flex-1 bg-slate-100 text-slate-800 px-4 py-2.5 rounded-full outline-none text-sm border-transparent focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white disabled:opacity-50 transition-colors">
                    <Send size={18} className="-ml-0.5" />
                </button>
            </form>
        </div>
    );
}
