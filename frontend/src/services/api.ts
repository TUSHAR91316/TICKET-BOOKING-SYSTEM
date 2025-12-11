import axios from 'axios';
import { Trip, Booking } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getTrips = async () => {
    const res = await api.get<Trip[]>('/trips');
    return res.data;
};

export const getTripDetails = async (id: number) => {
    const res = await api.get<Trip>(`/trips/${id}`);
    return res.data;
};

export const bookSeat = async (userId: number, seatId: number) => {
    const res = await api.post<Booking>('/bookings', { userId, seatId });
    return res.data;
};

export const createBus = async (data: any) => {
    return await api.post('/admin/bus', data);
}

export const createTrip = async (data: any) => {
    return await api.post('/admin/trip', data);
}
