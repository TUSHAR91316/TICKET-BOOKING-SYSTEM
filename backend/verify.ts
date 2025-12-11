import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function runVerification() {
    try {
        console.log('--- 1. Creating Bus ---');
        const random = Math.floor(Math.random() * 10000);
        const busRes = await axios.post(`${API_URL}/admin/bus`, {
            name: 'Test Volvo',
            number: `TEST-${random}`,
            type: 'AC',
            totalSeats: 10
        });
        const bus = busRes.data;
        console.log('✅ Bus Created:', bus.id);

        console.log('--- 2. Creating Trip ---');
        const tripRes = await axios.post(`${API_URL}/admin/trip`, {
            busId: bus.id,
            source: 'Mumbai',
            destination: 'Pune',
            startTime: new Date().toISOString(),
            endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toISOString(),
            price: 500
        });
        const trip = tripRes.data.trip;
        console.log('✅ Trip Created:', trip.id);

        console.log('--- 2.5 Creating Test Users ---');
        const user1 = await axios.post(`${API_URL}/users`, { name: 'User 1', email: `user1-${random}@test.com` });
        const user2 = await axios.post(`${API_URL}/users`, { name: 'User 2', email: `user2-${random}@test.com` });
        console.log('✅ Users Created:', user1.data.id, user2.data.id);

        console.log('--- 3. Testing Concurrency (Double Booking) ---');
        // We will try to book Seat 1 (id: unknown, need to find it from DB or response)
        // For simplicity, let's fetch the trip details to get seat IDs
        const tripDetails = await axios.get(`${API_URL}/trips/${trip.id}`);
        const seatId = tripDetails.data.seats[0].id;
        console.log('Target Seat ID:', seatId);

        const req1 = axios.post(`${API_URL}/bookings`, { userId: user1.data.id, seatId });
        const req2 = axios.post(`${API_URL}/bookings`, { userId: user2.data.id, seatId });

        const results = await Promise.allSettled([req1, req2]);

        let successCount = 0;
        let failCount = 0;

        results.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                console.log(`Request ${index + 1}: SUCCESS`, res.value.data);
                successCount++;
            } else {
                console.log(`Request ${index + 1}: FAILED`, res.reason.response?.data || res.reason.message);
                if (res.reason.response?.status === 409) {
                    console.log('   -> Correctly received 409 Conflict');
                }
                failCount++;
            }
        });

        if (successCount === 1 && failCount === 1) {
            console.log('\n🎉 CONCURRENCY TEST PASSED: Only one booking succeeded!');
        } else {
            console.error('\n❌ CONCURRENCY TEST FAILED: Unexpected results.');
        }

    } catch (error: any) {
        console.error('Verification Failed:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

runVerification();
