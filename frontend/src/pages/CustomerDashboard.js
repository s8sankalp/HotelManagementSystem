import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UserIcon, 
  CreditCardIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const CustomerDashboard = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch user data, bookings, and available rooms
            const [bookingsRes, roomsRes] = await Promise.all([
                api.getMyBookings(),
                api.getRooms()
            ]);
            
            setBookings(bookingsRes.data || []);
            setRooms(roomsRes.data || []);
            
            // Get user info from localStorage or decode JWT
            const userEmail = localStorage.getItem('userEmail') || 'Guest';
            setUser({ name: userEmail.split('@')[0], email: userEmail });
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED':
                return 'text-green-600 bg-green-100';
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-100';
            case 'CANCELLED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED':
                return <CheckCircleIcon className="w-4 h-4" />;
            case 'PENDING':
                return <ClockIcon className="w-4 h-4" />;
            case 'CANCELLED':
                return <ExclamationTriangleIcon className="w-4 h-4" />;
            default:
                return <ClockIcon className="w-4 h-4" />;
        }
    };

    const stats = [
        {
            name: 'Total Bookings',
            value: bookings.length,
            icon: CalendarIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'Active Bookings',
            value: bookings.filter(b => b.status === 'CONFIRMED').length,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Available Rooms',
            value: rooms.filter(r => r.available).length,
            icon: BuildingOfficeIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            name: 'Total Spent',
            value: `$${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toFixed(2)}`,
            icon: CreditCardIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name || 'Guest'}!
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with your hotel bookings
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card-hover">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/rooms/available"
                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-hotel-300 hover:bg-hotel-50 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5 text-hotel-600 mr-3" />
                            <span className="font-medium text-gray-900">Book a New Room</span>
                        </Link>
                        <Link
                            to="/my-bookings"
                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-hotel-300 hover:bg-hotel-50 transition-colors duration-200"
                        >
                            <CalendarIcon className="w-5 h-5 text-hotel-600 mr-3" />
                            <span className="font-medium text-gray-900">View My Bookings</span>
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-hotel-300 hover:bg-hotel-50 transition-colors duration-200"
                        >
                            <UserIcon className="w-5 h-5 text-hotel-600 mr-3" />
                            <span className="font-medium text-gray-900">Update Profile</span>
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    {bookings.length > 0 ? (
                        <div className="space-y-3">
                            {bookings.slice(0, 3).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-900">Room {booking.roomNumber}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="ml-1">{booking.status}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recent bookings</p>
                    )}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                    <Link
                        to="/my-bookings"
                        className="text-hotel-600 hover:text-hotel-700 font-medium text-sm"
                    >
                        View all bookings →
                    </Link>
                </div>
                
                {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Check-in
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Check-out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.slice(0, 5).map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                Room {booking.roomNumber}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.roomType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(booking.checkInDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${booking.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                <span className="ml-1">{booking.status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">Start your journey by booking your first room</p>
                        <Link
                            to="/rooms/available"
                            className="btn-primary"
                        >
                            Book Your First Room
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard; 