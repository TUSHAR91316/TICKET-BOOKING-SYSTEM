export interface Bus {
    id: number;
    name: string;
    number: string;
    type: string;
    totalSeats: number;
}

export interface Trip {
    id: number;
    busId: number;
    bus: Bus;
    source: string;
    destination: string;
    startTime: string;
    endTime: string;
    price: number;
    seats?: Seat[];
}

export interface Seat {
    id: number;
    tripId: number;
    seatNumber: string;
    status: 'AVAILABLE' | 'PENDING' | 'BOOKED';
}

export interface Booking {
    id: number;
    userId: number;
    seatId: number;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    seat: Seat;
}
