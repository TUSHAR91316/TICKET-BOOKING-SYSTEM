import { Router } from 'express';
import { createBus, createTrip } from '../controllers/admin.controller.js';
import { listTrips, getTripDetails } from '../controllers/trip.controller.js';
import { bookSeat, createUser } from '../controllers/booking.controller.js';

const router = Router();

// Admin Routes
router.post('/admin/bus', createBus);
router.post('/admin/trip', createTrip);

// User Routes
router.get('/trips', listTrips);
router.get('/trips/:id', getTripDetails);
router.post('/bookings', bookSeat);

// Helper
router.post('/users', createUser);

export default router;
