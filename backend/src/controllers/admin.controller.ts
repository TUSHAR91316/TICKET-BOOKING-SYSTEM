import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const createBus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, number, type, totalSeats } = req.body;
        const bus = await prisma.bus.create({
            data: { name, number, type, totalSeats },
        });
        return res.status(201).json(bus);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createTrip = async (req: Request, res: Response): Promise<any> => {
    try {
        const { busId, source, destination, startTime, endTime, price } = req.body;

        // Create Trip
        const trip = await prisma.trip.create({
            data: {
                busId: Number(busId),
                source,
                destination,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                price: Number(price)
            },
            include: { bus: true }
        });

        // Create Seats for the trip
        const seatsData = [];
        const totalSeats = trip.bus.totalSeats;

        // Simple logic: 4 seats per row. 1A, 1B, 1C, 1D, etc.
        // Or just 1, 2, 3... for simplicity or user requirements.
        // Let's do numbered seats for simplicity: "1", "2", ... 
        for (let i = 1; i <= totalSeats; i++) {
            seatsData.push({
                tripId: trip.id,
                seatNumber: i.toString(),
                status: 'AVAILABLE' as 'AVAILABLE'
            });
        }

        await prisma.seat.createMany({ data: seatsData });

        return res.status(201).json({ message: 'Trip and seats created', trip });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
