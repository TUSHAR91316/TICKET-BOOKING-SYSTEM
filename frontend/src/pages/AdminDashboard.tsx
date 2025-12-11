import React, { useState } from 'react';
import { createBus, createTrip } from '../services/api';

export const AdminDashboard = () => {
    const [busData, setBusData] = useState({ name: '', number: '', type: 'AC', totalSeats: 40 });
    const [tripData, setTripData] = useState({ busId: '', source: '', destination: '', startTime: '', endTime: '', price: '' });
    const [msg, setMsg] = useState('');

    // Handlers...
    const handleCreateBus = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBus(busData);
            setMsg('Bus Created Successfully');
            setBusData({ name: '', number: '', type: 'AC', totalSeats: 40 });
        } catch (error) {
            setMsg('Error creating bus');
        }
    };

    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTrip(tripData);
            setMsg('Trip Created Successfully');
        } catch (error) {
            setMsg('Error creating trip');
        }
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            {msg && <div style={{ padding: '1rem', background: '#DBEAFE', color: '#1E40AF', marginBottom: '1rem' }}>{msg}</div>}

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card">
                    <h2>Add Bus</h2>
                    <form onSubmit={handleCreateBus} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label className="label">Bus Name</label>
                            <input className="input" value={busData.name} onChange={e => setBusData({ ...busData, name: e.target.value })} required placeholder="e.g. Volvo 9400" />
                        </div>
                        <div>
                            <label className="label">Bus Number</label>
                            <input className="input" value={busData.number} onChange={e => setBusData({ ...busData, number: e.target.value })} required placeholder="MH 12 AB 1234" />
                        </div>
                        <div>
                            <label className="label">Type</label>
                            <select className="input" value={busData.type} onChange={e => setBusData({ ...busData, type: e.target.value })}>
                                <option>AC</option>
                                <option>Non-AC</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" type="submit">Create Bus</button>
                    </form>
                </div>

                <div className="card">
                    <h2>Add Trip</h2>
                    <form onSubmit={handleCreateTrip} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label className="label">Bus ID</label>
                            <input type="number" className="input" value={tripData.busId} onChange={e => setTripData({ ...tripData, busId: e.target.value })} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Source</label>
                                <input className="input" value={tripData.source} onChange={e => setTripData({ ...tripData, source: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Destination</label>
                                <input className="input" value={tripData.destination} onChange={e => setTripData({ ...tripData, destination: e.target.value })} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Start Time</label>
                                <input type="datetime-local" className="input" value={tripData.startTime} onChange={e => setTripData({ ...tripData, startTime: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">End Time</label>
                                <input type="datetime-local" className="input" value={tripData.endTime} onChange={e => setTripData({ ...tripData, endTime: e.target.value })} required />
                            </div>
                        </div>
                        <div>
                            <label className="label">Price</label>
                            <input type="number" className="input" value={tripData.price} onChange={e => setTripData({ ...tripData, price: e.target.value })} required />
                        </div>
                        <button className="btn btn-primary" type="submit">Create Trip</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
