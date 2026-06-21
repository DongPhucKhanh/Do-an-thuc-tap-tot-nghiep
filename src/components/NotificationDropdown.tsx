import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                if (res.data.success) {
                    setNotifications(res.data.data.notifications);
                    setUnreadCount(res.data.data.unreadCount);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifications();
        
        // Cập nhật mỗi 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const handleNotificationClick = async (n: any) => {
        if (!n.isRead) {
            await api.put(`/notifications/${n.id}/read`);
            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        if (n.link) {
            setIsOpen(false);
            navigate(n.link);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569', position: 'relative', transition: 'all 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                className="dark:text-slate-300 dark:hover:bg-slate-800"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '2px', right: '2px',
                        backgroundColor: '#ef4444', color: 'white',
                        fontSize: '10px', fontWeight: 'bold',
                        width: '16px', height: '16px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute', top: 'calc(100% + 10px)', right: '-40px',
                            width: '320px', maxHeight: '400px', backgroundColor: '#fff',
                            borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0', zIndex: 100, display: 'flex', flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        className="dark:bg-slate-900 dark:border-slate-700"
                    >
                        {/* Header */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="dark:border-slate-700">
                            <span style={{ fontWeight: 600, fontSize: '15px' }} className="dark:text-white">Thông báo</span>
                            {unreadCount > 0 && (
                                <button onClick={handleMarkAllAsRead} style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} className="dark:text-blue-400">
                                    Đánh dấu đã đọc tất cả
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div style={{ overflowY: 'auto', flex: 1, maxHeight: '340px' }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                    Bạn chưa có thông báo nào.
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div 
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        style={{ 
                                            padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
                                            backgroundColor: n.isRead ? 'transparent' : '#eff6ff',
                                            cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start',
                                            transition: 'background-color 0.2s'
                                        }}
                                        className="hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 dark:bg-slate-900"
                                        onMouseEnter={e => { if(n.isRead) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc' }}
                                        onMouseLeave={e => { if(n.isRead) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                                    >
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            backgroundColor: n.isRead ? 'transparent' : '#3b82f6',
                                            marginTop: '6px', flexShrink: 0
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#0f172a', marginBottom: '2px' }} className="dark:text-slate-200">
                                                {n.title}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }} className="dark:text-slate-400">
                                                {n.content}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                                {new Date(n.createdAt).toLocaleString('vi-VN')}
                                                {n.link && <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#2563eb' }}><ExternalLink size={10} /> Xem chi tiết</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
