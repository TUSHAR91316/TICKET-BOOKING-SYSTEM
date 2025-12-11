import prisma from '../utils/prisma.js';
import { Prisma } from '@prisma/client';

export const bookSeatTransaction = async (userId: number, seatId: number) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Lock the Seat Row
        // Postgres specific: SELECT ... FOR UPDATE
        const seat = await tx.$queryRaw<any[]>`
      SELECT * FROM "Seat" WHERE id = ${seatId} FOR UPDATE
    `;

        if (!seat || seat.length === 0) {
            throw new Error('Seat not found');
        }

        const currentSeat = seat[0];

        // 2. Check Availability
        if (currentSeat.status !== 'AVAILABLE') {
            throw new Error(`Seat ${currentSeat.seatNumber} is already booked or pending`);
        }

        // 3. Update Seat Status to PENDING
        await tx.seat.update({
            where: { id: seatId },
            data: { status: 'PENDING' },
        });

        // 4. Create Booking Record
        // TODO: Create a mock user if not exists or handle user logic
        const booking = await tx.booking.create({
            data: {
                userId,
                seatId,
                status: 'PENDING',
            },
        });

        return booking;
    });
};

export const confirmBookingTransaction = async (bookingId: number) => {
    return await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({ where: { id: bookingId }, include: { seat: true } });
        if (!booking) throw new Error('Booking not found');
        if (booking.status !== 'PENDING') throw new Error('Booking is not pending');

        await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' }
        });

        await tx.seat.update({
            where: { id: booking.seatId },
            data: { status: 'BOOKED' }
        });

        return booking;
    });
}
