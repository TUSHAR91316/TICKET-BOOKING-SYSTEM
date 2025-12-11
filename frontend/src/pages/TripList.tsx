import React, { useEffect, useState } from 'react';
import { getTrips } from '../services/api';
import { Trip } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

export const TripList = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTrips().then(setTrips).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container">Loading trips...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Available Trips</h1>
            <div className="grid">
                {trips.map(trip => (
                    <div key={trip.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h2 style={{ margin: 0 }}>{trip.source}</h2>
                                <ArrowRight size={20} color="#9CA3AF" />
                                <h2 style={{ margin: 0 }}>{trip.destination}</h2>
                            </div>
                            <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={14} />
                                    {new Date(trip.startTime).toLocaleString()}
                                </span>
                                <span>Bus: {trip.bus.name} ({trip.bus.type})</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                ${trip.price}
                            </div>
                            <Link to={`/booking/${trip.id}`} className="btn btn-primary">
                                Book Seats
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
