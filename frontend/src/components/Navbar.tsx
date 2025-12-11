import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, User } from 'lucide-react';

export const Navbar = () => {
    const { user } = useAuth();
    return (
        <nav style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    <Bus />
                    <span>BusBooker</span>
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Home</Link>
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Admin</Link>
                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <User size={16} />
                            {user.name}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
