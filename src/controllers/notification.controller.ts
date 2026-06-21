import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const unreadCount = notifications.filter(n => !n.isRead).length;

        res.json({
            success: true,
            data: { notifications, unreadCount }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;

        await prisma.notification.updateMany({
            where: { id: Number(id), userId },
            data: { isRead: true }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
