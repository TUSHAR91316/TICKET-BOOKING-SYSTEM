# 🚌 Bus Ticket Booking System (Modex Assessment)

**🔴 Live Demo (Frontend):** [https://ticket-booking-system-alpha.vercel.app/](https://ticket-booking-system-alpha.vercel.app/)
**🟢 Live API (Backend):** [https://ticket-booking-system-shz7.onrender.com](https://ticket-booking-system-shz7.onrender.com)

A high-performance, concurrent **Bus Ticket Booking System** built with **Node.js, Express, TypeScript, PostgreSQL (Prisma)**, and **React**.

This project demonstrates a robust implementation of a booking system that handles **concurrency anomalies** (like double-booking) using **Database Row-Level Locking**.

---

## 🚀 Features

- **Users**: Browse Trips, View Live Seat Availability, Book Seats.
- **Admin**: Create Buses & Trips.
- **Concurrency Safety**: Ensures no two users can book the same seat simultaneously (simulated in `backend/verify.ts`).
- **Interactive UI**: Visual Seat Map with Real-time status indicators.
- **Architecture**: Clean, modular structure using Controllers, Services, and Typed interfaces.

---

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: API Server.
- **TypeScript**: Type safety and better tooling.
- **PostgreSQL**: Relational Database.
- **Prisma ORM**: Type-safe database access and migrations.
- **Concurrency**: `SELECT ... FOR UPDATE` (Pessimistic Locking).

### Frontend
- **React**: UI Library.
- **Vite**: Fast build tool.
- **TypeScript**: Component prop validation.
- **CSS Modules / Vanilla**: Clean styling with CSS variables.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Backend Setup
```bash
cd backend
npm install

# Setup Environment Variables
# Create .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/bus_booking?schema=public"
# PORT=3000

# Run Migrations
npx prisma migrate dev

# Start Server
npm run dev
```
Server runs on `http://localhost:3000`.

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Dev Server
npm run dev
```
App runs on `http://localhost:5173`.

---

## 📡 API Endpoints

### Admin
- `POST /api/admin/bus`: Create a new Bus.
- `POST /api/admin/trip`: Create a new Trip for a Bus.

### Public/User
- `GET /api/trips`: List all available trips.
- `GET /api/trips/:id`: Get trip details (including seat status).
- `POST /api/bookings`: Book a seat.
    - Body: `{ userId, seatId }`
- `POST /api/users`: Create a temporary user (for testing).

---

## 🏗 System Design & Scalability

### High-Level Architecture
Client (React) <-> Load Balancer <-> API Server (Node/Express) <-> Database (PostgreSQL)

### Concurrency Handling
To prevent **Race Conditions** where two users book the same seat:
1. We use **Postgres Transactions**.
2. Specifically, we use `SELECT * FROM "Seat" WHERE id = $1 FOR UPDATE`.
3. This **locks** the specific seat row.
4. If a second request comes in for the same seat, it is forced to **wait** until the first transaction commits or rolls back.
5. If the first transaction succeeds (books the seat), the second request will see the status as `BOOKED` or `PENDING` and fail gracefully.

### Scaling
- **Database**: Read Replicas can be added for listing trips (Read-heavy operation). Sharding by `TripId` or `Region` for write-heavy booking loads.
- **Caching**: Redis can cache `GET /trips` responses for 30s to reduce DB load.
- **Queue**: For extremely high traffic (e.g. Flash Sales), a message queue (RabbitMQ/Kafka) could process booking requests asynchronously.

---

## ✅ Evaluation Highlights
- **Architecture**: Separation of Controller and Service layers.
- **Code Quality**: Strict TypeScript usage, consistent error handling.
- **Innovation**: Real-time visual feedback and simple, effective locking strategy.

---

## 🧪 Testing Concurrency
Run the verification script to simulate simultaneous bookings:
```bash
cd backend
npx tsx verify.ts
```
Expected Output: `🎉 CONCURRENCY TEST PASSED: Only one booking succeeded!`
