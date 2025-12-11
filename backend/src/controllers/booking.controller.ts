import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service.js';
import prisma from '../utils/prisma.js';

export const bookSeat = async (req: Request, res: Response): Promise<any> => {
    try {
        const { seatId, userId } = req.body;
        // Basic validation
        if (!seatId || !userId) return res.status(400).json({ error: 'Missing seatId or userId' });

        const booking = await bookingService.bookSeatTransaction(Number(userId), Number(seatId));
        return res.status(201).json(booking);
    } catch (error: any) {
        // Handle concurrency error gracefully
        if (error.message.includes('already booked')) {
            return res.status(409).json({ error: error.message }); // 409 Conflict
        }
        return res.status(500).json({ error: error.message });
    }
}

// Simple helper to create a user for testing
export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email } = req.body;
        const user = await prisma.user.create({ data: { name, email } });
        return res.status(201).json(user);
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}
