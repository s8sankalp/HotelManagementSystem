import React, { useState, useEffect } from 'react';
import { 
    CalendarIcon, 
    MapPinIcon, 
    CurrencyDollarIcon, 
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    TrashIcon,
    EyeIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ViewBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.getMyBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        try {
            await api.cancelBooking(bookingId);
            setBookings(bookings.filter(b => b.id !== bookingId));
            toast.success('Booking cancelled successfully');
        } catch (error) {
            console.error('Failed to cancel booking', error);
            toast.error('Failed to cancel booking');
        }
    };

    const getBookingStatus = (checkInDate, checkOutDate) => {
        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (today < checkIn) {
            return { status: 'upcoming', label: 'Upcoming', color: 'blue', icon: ClockIcon };
        } else if (today >= checkIn && today <= checkOut) {
            return { status: 'active', label: 'Active', color: 'green', icon: CheckCircleIcon };
        } else {
            return { status: 'completed', label: 'Completed', color: 'gray', icon: CheckCircleIcon };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateNights = (checkInDate, checkOutDate) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotalPrice = (price, checkInDate, checkOutDate) => {
        const nights = calculateNights(checkInDate, checkOutDate);
        return (parseFloat(price) * nights).toFixed(2);
    };

    const getRoomTypeColor = (type) => {
        const colors = {
            'Standard': 'bg-blue-100 text-blue-800',
            'Deluxe': 'bg-purple-100 text-purple-800',
            'Suite': 'bg-yellow-100 text-yellow-800',
            'Presidential': 'bg-red-100 text-red-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getRoomTypeIcon = (type) => {
        const icons = {
            'Standard': '🏠',
            'Deluxe': '🏨',
            'Suite': '🏰',
            'Presidential': '👑'
        };
        return icons[type] || '��';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">Manage and view all your hotel reservations</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ClockIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => getBookingStatus(b.checkInDate, b.checkOutDate).status === 'upcoming').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => getBookingStatus(b.checkInDate, b.checkOutDate).status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => getBookingStatus(b.checkInDate, b.checkOutDate).status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${bookings.reduce((total, booking) => 
                                        total + parseFloat(calculateTotalPrice(booking.room.price, booking.checkInDate, booking.checkOutDate)), 0
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <CalendarIcon className="h-full w-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                        <button
                            onClick={() => window.location.href = '/book-room'}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Book Your First Room
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map((booking) => {
                            const status = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                            const StatusIcon = status.icon;
                            const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                            const totalPrice = calculateTotalPrice(booking.room.price, booking.checkInDate, booking.checkOutDate);

                            return (
                                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {/* Header */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{getRoomTypeIcon(booking.room.type)}</span>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Room {booking.room.roomNumber}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomTypeColor(booking.room.type)}`}>
                                                        {booking.room.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                status.color === 'green' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                <StatusIcon className="h-4 w-4 mr-1" />
                                                {status.label}
                                            </div>
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                                                <span className="font-medium">${booking.room.price}</span>
                                                <span className="text-sm ml-1">/night</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Total for {nights} nights</p>
                                                <p className="text-lg font-bold text-gray-900">${totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
                                                <div>
                                                    <p className="text-sm font-medium">Check-in</p>
                                                    <p className="text-sm">{formatDate(booking.checkInDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <CalendarIcon className="h-5 w-5 mr-3 text-red-500" />
                                                <div>
                                                    <p className="text-sm font-medium">Check-out</p>
                                                    <p className="text-sm">{formatDate(booking.checkOutDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPinIcon className="h-5 w-5 mr-3 text-green-500" />
                                                <div>
                                                    <p className="text-sm font-medium">Duration</p>
                                                    <p className="text-sm">{nights} night{nights !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowDetails(true);
                                                }}
                                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                View Details
                                            </button>
                                            {status.status === 'upcoming' && (
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {showDetails && selectedBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Room Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Room Number</p>
                                            <p className="font-medium">{selectedBooking.room.roomNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Type</p>
                                            <p className="font-medium">{selectedBooking.room.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Price per Night</p>
                                            <p className="font-medium">${selectedBooking.room.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Price</p>
                                            <p className="font-medium">${calculateTotalPrice(selectedBooking.room.price, selectedBooking.checkInDate, selectedBooking.checkOutDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Stay Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Check-in Date</p>
                                            <p className="font-medium">{formatDate(selectedBooking.checkInDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Check-out Date</p>
                                            <p className="font-medium">{formatDate(selectedBooking.checkOutDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="font-medium">{calculateNights(selectedBooking.checkInDate, selectedBooking.checkOutDate)} nights</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className="font-medium">{getBookingStatus(selectedBooking.checkInDate, selectedBooking.checkOutDate).label}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Booking ID</p>
                                            <p className="font-medium">#{selectedBooking.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Guest</p>
                                            <p className="font-medium">{selectedBooking.user?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {getBookingStatus(selectedBooking.checkInDate, selectedBooking.checkOutDate).status === 'upcoming' && (
                                    <button
                                        onClick={() => {
                                            handleCancel(selectedBooking.id);
                                            setShowDetails(false);
                                        }}
                                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewBookingsPage; 