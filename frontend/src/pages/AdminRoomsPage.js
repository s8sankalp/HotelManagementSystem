import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    // Add state for new room form

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.getRooms();
                setRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms', error);
            }
        };
        fetchRooms();
    }, []);

    // Add handlers for add, update, delete

    return (
        <div>
            <h2>Manage Rooms</h2>
            {/* Add form for new room here */}
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>
                        {room.roomNumber} - {room.type} - ${room.price} - {room.isAvailable ? 'Available' : 'Booked'}
                        {/* Add edit/delete buttons here */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminRoomsPage; 