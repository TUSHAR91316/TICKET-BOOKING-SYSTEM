import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TripList } from './pages/TripList';
import { BookingPage } from './pages/BookingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<TripList />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/booking/:id" element={<BookingPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
