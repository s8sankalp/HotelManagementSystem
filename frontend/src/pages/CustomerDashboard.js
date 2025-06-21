import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    return (
        <div>
            <h1>Customer Dashboard</h1>
            <nav>
                <Link to="/rooms/available">Book a Room</Link>
                <Link to="/my-bookings">My Bookings</Link>
            </nav>
        </div>
    );
};

export default CustomerDashboard; 