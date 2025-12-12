# System Design Document - Bus Ticket Booking System

## 1. Introduction
This document outlines the technical architecture, design decisions, and scalability strategies for the Bus Ticket Booking System. The system is designed to handle high concurrency, ensuring data consistency and preventing overbooking anomalies.

## 2. High-Level Architecture
The system follows a **3-Tier Architecture**:

1.  **Presentation Layer (Frontend)**:
    *   **Tech**: React, TypeScript, Vite.
    *   **Responsibility**: User Interface for booking, admin dashboard, seat selection visualization.
    *   **Communication**: REST API calls to the backend.

2.  **Application Layer (Backend)**:
    *   **Tech**: Node.js, Express, TypeScript.
    *   **Structure**: Layered Architecture (Controller -> Service -> Data Access).
    *   **Responsibility**: Business logic, request validation, transaction management, concurrency control.

3.  **Data Layer (Database)**:
    *   **Tech**: PostgreSQL.
    *   **Responsibility**: Persistent storage of Buses, Trips, Seats, and Bookings.
    *   **Key Feature**: Row-Level Locking for concurrency.

**Diagram**:
```mermaid
graph LR
    User[Client Browser] -->|HTTPS| Vercel[Frontend (Vercel)]
    Vercel -->|REST API| Render[Backend (Render)]
    Render -->|SQL Queries| DB[(PostgreSQL)]
```

## 3. Database Design
The schema is normalized to ensure integrity.

*   **Bus**: Represents physical buses (`id`, `name`, `number`, `type`, `totalSeats`).
*   **Trip**: Represents a journey (`id`, `busId`, `source`, `destination`, `startTime`, `endTime`, `price`).
*   **Seat**: Individual units of inventory (`id`, `tripId`, `seatNumber`, `status` [AVAILABLE, PENDING, BOOKED]).
*   **Booking**: distinct reservation records (`id`, `userId`, `seatId`, `status`).

**Scalability Consideration**: 
*   **Indexing**: `tripId` on Seats table and `status` for fast lookup.
*   **Sharding**: In a large-scale scenario, we would shard the Database by `TripId` or `Region` so that bookings for different trips go to different DB nodes, distributing the write load.

## 4. Concurrency & Overbooking Prevention
The critical challenge is preventing two users from booking the same seat simultaneously.

### Strategy: Pessimistic Locking
We use PostgreSQL's `SELECT ... FOR UPDATE` mechanism.

**Workflow**:
1.  **User A** and **User B** request `Seat #10` at the same time.
2.  **User A's** database transaction starts first.
3.  It executes `SELECT * FROM "Seat" WHERE id=10 FOR UPDATE`.
4.  The Database **LOCKS** this row. No other transaction can modify it.
5.  **User B's** transaction tries to select/lock the same row but is forced to **WAIT**.
6.  **User A** updates status to `PENDING` and **COMMITS**.
7.  **User B's** transaction acquires the lock, reads the row, sees status is now `PENDING` (not `AVAILABLE`), and aborts with an error.

This guarantees strict atomicity and consistency.

## 5. Scalability Strategy (Production Grade)

To scale this to millions of users (like RedBus):

1.  **Read Replicas**: 
    *   Listing trips (`GET /trips`) is a read-heavy operation (90% reads, 10% writes).
    *   We would deploy Postgres Read Replicas. The application would read from replicas and write to the Primary.
    
2.  **Caching (Redis)**:
    *   Trip lists and Bus details don't change often.
    *   Implement **Redis** to cache API responses for search queries (e.g., "Mumbai to Pune").
    *   Invalidate cache specific keys on new Trip creation.

3.  **Load Balancing**:
    *   Deploy multiple instances of the Node.js backend behind a Load Balancer (Nginx or AWS ALB).
    *   Since the backend is stateless, we can horizontally scale to infinite instances.

4.  **Asynchronous Processing**:
    *   Booking confirmations, Email notifications, and Payment processing should be offloaded to a Message Queue (e.g., RabbitMQ or AWS SQS) to keep the API response fast.

## 6. API Design
RESTful principles are followed with predictible resource URLs.
*   `GET /api/trips`: Collection resource.
*   `POST /api/bookings`: Action resource.
*   Standard HTTP Status Codes: `200` (OK), `201` (Created), `400` (Bad Request), `409` (Conflict/Concurrency Error), `500` (Server Error).
