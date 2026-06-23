import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendContactReplyEmail } from '../utils/email.util';

const prisma = new PrismaClient();

// Gửi liên hệ mới (Public)
export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const newContact = await prisma.contact.create({
            data: { name, email, subject, message }
        });

        res.status(201).json({ success: true, message: 'Gửi liên hệ thành công', data: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi gửi liên hệ' });
    }
};

// Lấy danh sách liên hệ (Admin)
export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách liên hệ' });
    }
};

// Admin phản hồi liên hệ
export const replyContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung phản hồi' });
        }

        const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ' });
        }

        if (contact.status === 'REPLIED') {
            return res.status(400).json({ success: false, message: 'Liên hệ này đã được phản hồi' });
        }

        // Cập nhật DB
        const updatedContact = await prisma.contact.update({
            where: { id: Number(id) },
            data: {
                reply,
                status: 'REPLIED'
            }
        });

        // Gửi email
        await sendContactReplyEmail(contact.email, contact.name, reply);

        res.json({ success: true, message: 'Đã gửi phản hồi thành công', data: updatedContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi phản hồi liên hệ' });
    }
};
