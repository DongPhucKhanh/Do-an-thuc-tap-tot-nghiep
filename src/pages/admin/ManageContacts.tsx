import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Mail, CheckCircle, Clock, Reply, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { palette } from '../../styles/adminTheme';

export default function ManageContacts() {
    const { isDark } = useTheme();
    const p = isDark ? palette.dark : palette.light;

    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/contacts');
            if (res.data.success) {
                setContacts(res.data.data);
            }
        } catch (error) {
            console.error('Lỗi lấy liên hệ:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleReply = async () => {
        if (!replyContent.trim()) {
            alert('Vui lòng nhập nội dung phản hồi.');
            return;
        }
        setIsReplying(true);
        try {
            await api.put(`/contacts/${selectedContact.id}/reply`, { reply: replyContent });
            alert('Đã gửi phản hồi thành công!');
            setSelectedContact(null);
            setReplyContent('');
            fetchContacts();
        } catch (error) {
            alert('Lỗi khi gửi phản hồi');
            console.error(error);
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div style={{ padding: '24px', color: p.text }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: p.text }}>Quản lý Liên hệ</h2>
            <p style={{ color: p.textSub, marginBottom: '24px' }}>Xem và phản hồi các thắc mắc từ người dùng.</p>

            <div style={{ backgroundColor: p.surface, borderRadius: '8px', border: `1px solid ${p.border}`, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: p.surfaceHover, borderBottom: `2px solid ${p.border}` }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: 600, color: p.textSub, fontSize: '13px', textTransform: 'uppercase' }}>Người gửi</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: p.textSub, fontSize: '13px', textTransform: 'uppercase' }}>Tiêu đề</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: p.textSub, fontSize: '13px', textTransform: 'uppercase' }}>Ngày gửi</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: p.textSub, fontSize: '13px', textTransform: 'uppercase' }}>Trạng thái</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: p.textSub, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: p.textSub }}>Đang tải dữ liệu...</td></tr>
                        ) : contacts.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: p.textSub }}>Không có liên hệ nào</td></tr>
                        ) : (
                            contacts.map(contact => (
                                <tr key={contact.id} style={{ borderBottom: `1px solid ${p.border}` }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 500, color: p.text }}>{contact.name}</div>
                                        <div style={{ fontSize: '13px', color: p.textSub }}>{contact.email}</div>
                                    </td>
                                    <td style={{ padding: '16px', maxWidth: '250px' }}>
                                        <div style={{ fontWeight: 500, color: p.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.subject}</div>
                                        <div style={{ fontSize: '13px', color: p.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.message}</div>
                                    </td>
                                    <td style={{ padding: '16px', color: p.textSub, fontSize: '14px' }}>
                                        {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {contact.status === 'REPLIED' ? (
                                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <CheckCircle size={14} /> Đã phản hồi
                                            </span>
                                        ) : (
                                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> Chờ phản hồi
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => setSelectedContact(contact)}
                                            style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <Reply size={14} /> {contact.status === 'REPLIED' ? 'Xem chi tiết' : 'Phản hồi'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Phản Hồi */}
            {selectedContact && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: p.surface, width: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${p.border}` }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: p.text }}>Chi tiết Liên hệ</h3>
                            <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', color: p.textSub, cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: p.surfaceHover, borderRadius: '8px' }}>
                                <div style={{ fontSize: '13px', color: p.textSub, marginBottom: '4px' }}>Từ: <strong>{selectedContact.name}</strong> ({selectedContact.email})</div>
                                <div style={{ fontSize: '13px', color: p.textSub, marginBottom: '8px' }}>Tiêu đề: <strong>{selectedContact.subject}</strong></div>
                                <div style={{ fontSize: '14px', color: p.text, whiteSpace: 'pre-wrap' }}>{selectedContact.message}</div>
                            </div>

                            {selectedContact.status === 'REPLIED' ? (
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: p.text }}>Nội dung đã phản hồi:</label>
                                    <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: p.text, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                                        {selectedContact.reply}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: p.text }}>Soạn email phản hồi:</label>
                                    <textarea 
                                        rows={5}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${p.border}`, backgroundColor: p.surfaceHover, color: p.text, outline: 'none', resize: 'none' }}
                                        placeholder="Nhập nội dung phản hồi. Hệ thống sẽ tự động gửi email cho người dùng..."
                                    />
                                </div>
                            )}
                        </div>
                        {selectedContact.status !== 'REPLIED' && (
                            <div style={{ padding: '16px 20px', borderTop: `1px solid ${p.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={() => setSelectedContact(null)} style={{ padding: '8px 16px', border: `1px solid ${p.border}`, backgroundColor: 'transparent', color: p.textSub, borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Hủy</button>
                                <button onClick={handleReply} disabled={isReplying} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, opacity: isReplying ? 0.7 : 1 }}>
                                    {isReplying ? 'Đang gửi...' : 'Gửi phản hồi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
