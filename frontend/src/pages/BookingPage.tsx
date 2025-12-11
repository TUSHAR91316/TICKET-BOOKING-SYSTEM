import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripDetails, bookSeat } from '../services/api';
import { Trip, Seat } from '../types';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx'; // Assuming installed, or use template literals
import { AlertCircle, CheckCircle } from 'lucide-react';

export const BookingPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchTrip = () => {
        if (!id) return;
        getTripDetails(Number(id)).then(data => {
            setTrip(data);
            // If selected seat is now booked by someone else, deselect it
            if (selectedSeat) {
                const seat = data.seats?.find(s => s.id === selectedSeat);
                if (seat && seat.status !== 'AVAILABLE') {
                    setSelectedSeat(null);
                    setErrorMsg('The seat you selected was just booked by someone else.');
                }
            }
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTrip();
        const interval = setInterval(fetchTrip, 5000); // Polling for live updates
        return () => clearInterval(interval);
    }, [id]);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status !== 'AVAILABLE') return;
        setSelectedSeat(seat.id);
        setErrorMsg('');
        setBookingStatus('idle');
    };

    const handleConfirmBooking = async () => {
        if (!selectedSeat || !user) return;
        setBookingStatus('pending');
        try {
            await bookSeat(user.id, selectedSeat);
            setBookingStatus('success');
            // Optimistically update
            fetchTrip();
        } catch (err: any) {
            setBookingStatus('error');
            setErrorMsg(err.response?.data?.error || 'Booking failed');
            fetchTrip(); // Refresh to see real status
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!trip) return <div className="container">Trip not found</div>;

    return (
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
            <div className="card">
                <h2>Select Seats</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="seat available" style={{ width: 20, height: 20 }}></div> Available
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="seat selected" style={{ width: 20, height: 20 }}></div> Selected
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="seat booked" style={{ width: 20, height: 20 }}></div> Booked
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                    {trip.seats?.map(seat => (
                        <button
                            key={seat.id}
                            className={`seat ${seat.status.toLowerCase()} ${selectedSeat === seat.id ? 'selected' : ''}`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status !== 'AVAILABLE'}
                        >
                            {seat.seatNumber}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ height: 'fit-content' }}>
                <h3>Booking Summary</h3>
                <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Trip:</strong> {trip.source} → {trip.destination}</p>
                    <p><strong>Date:</strong> {new Date(trip.startTime).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(trip.startTime).toLocaleTimeString()}</p>
                    <p><strong>Price:</strong> ${trip.price}</p>
                </div>

                {selectedSeat && (
                    <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                        Selected Seat: <strong>{trip.seats?.find(s => s.id === selectedSeat)?.seatNumber}</strong>
                    </div>
                )}

                {errorMsg && (
                    <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {errorMsg}
                    </div>
                )}

                {bookingStatus === 'success' && (
                    <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} /> Booking Confirmed!
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={!selectedSeat || bookingStatus === 'pending' || bookingStatus === 'success'}
                    onClick={handleConfirmBooking}
                >
                    {bookingStatus === 'pending' ? 'Booking...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};
