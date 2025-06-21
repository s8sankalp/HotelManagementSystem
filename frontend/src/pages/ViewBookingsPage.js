import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ViewBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.getMyBookings();
                setBookings(response.data);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        try {
            await api.cancelBooking(bookingId);
            setBookings(bookings.filter(b => b.id !== bookingId));
        } catch (error) {
            console.error('Failed to cancel booking', error);
        }
    };

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.map(booking => (
                <div key={booking.id}>
                    <p>Room: {booking.room.roomNumber}</p>
                    <p>Check-in: {booking.checkInDate}</p>
                    <p>Check-out: {booking.checkOutDate}</p>
                    <button onClick={() => handleCancel(booking.id)}>Cancel</button>
                </div>
            ))}
        </div>
    );
};

export default ViewBookingsPage; 