import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const RoomBookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await api.getRoomById(id);
                setRoom(response.data);
            } catch (error) {
                console.error('Failed to fetch room', error);
            }
        };
        fetchRoom();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createBooking({ roomId: id, checkInDate, checkOutDate });
            navigate('/my-bookings');
        } catch (error) {
            console.error('Booking failed', error);
        }
    };

    if (!room) return <div>Loading...</div>;

    return (
        <div>
            <h2>Book Room: {room.roomNumber}</h2>
            <p>Type: {room.type}</p>
            <p>Price: ${room.price}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                />
                <button type="submit">Book Now</button>
            </form>
        </div>
    );
};

export default RoomBookingPage; 