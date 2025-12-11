import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const listTrips = async (req: Request, res: Response): Promise<any> => {
    try {
        const trips = await prisma.trip.findMany({
            include: { bus: true },
        });
        return res.json(trips);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getTripDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({
            where: { id: Number(id) },
            include: {
                bus: true,
                seats: {
                    orderBy: { id: 'asc' } // Ensure consistent order
                }
            }
        });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        return res.json(trip);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
