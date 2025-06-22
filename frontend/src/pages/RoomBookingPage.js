import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  EyeIcon,
  StarIcon,
  WifiIcon,
  TvIcon,
  SnowflakeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const RoomBookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guestName: '',
        guestEmail: '',
        specialRequests: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            fetchRoom();
        } else {
            fetchAvailableRooms();
        }
    }, [id]);

    const fetchRoom = async () => {
        try {
            const response = await api.getRoomById(id);
            setRoom(response.data);
        } catch (error) {
            console.error('Failed to fetch room', error);
            toast.error('Failed to load room details');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableRooms = async () => {
        try {
            const response = await api.getRooms();
            setRooms(response.data || []);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
            toast.error('Failed to load available rooms');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);

        if (!formData.checkInDate) {
            newErrors.checkInDate = 'Check-in date is required';
        } else if (checkIn < today) {
            newErrors.checkInDate = 'Check-in date cannot be in the past';
        }

        if (!formData.checkOutDate) {
            newErrors.checkOutDate = 'Check-out date is required';
        } else if (checkOut <= checkIn) {
            newErrors.checkOutDate = 'Check-out date must be after check-in date';
        }

        if (!formData.guestName.trim()) {
            newErrors.guestName = 'Guest name is required';
        }

        if (!formData.guestEmail.trim()) {
            newErrors.guestEmail = 'Guest email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
            newErrors.guestEmail = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalPrice = () => {
        if (!formData.checkInDate || !formData.checkOutDate || !room) return 0;
        
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        return nights * room.price;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const bookingData = {
                roomId: id,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                specialRequests: formData.specialRequests,
                totalPrice: calculateTotalPrice()
            };
            
            await api.createBooking(bookingData);
            toast.success('Booking created successfully!');
            navigate('/my-bookings');
        } catch (error) {
            console.error('Booking failed', error);
            const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoomImage = (roomType) => {
        const images = {
            'Standard Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
            'Deluxe Room': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
            'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
        };
        return images[roomType] || images['Standard Room'];
    };

    const getRoomAmenities = (roomType) => {
        const amenities = {
            'Standard Room': ['WiFi', 'TV', 'AC', 'Private Bathroom'],
            'Deluxe Room': ['WiFi', 'TV', 'AC', 'Private Bathroom', 'Mini Bar', 'City View'],
            'Suite': ['WiFi', 'TV', 'AC', 'Private Bathroom', 'Mini Bar', 'City View', 'Balcony', 'Room Service']
        };
        return amenities[roomType] || amenities['Standard Room'];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-hotel-50 to-hotel-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-hotel-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-hotel-600 font-medium">Loading amazing rooms...</p>
                </div>
            </div>
        );
    }

    // If no room ID is provided, show available rooms
    if (!id) {
        const availableRooms = rooms.filter(room => room.available);
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-hotel-50 to-hotel-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center text-hotel-600 hover:text-hotel-700 mb-6 transition-colors duration-200 group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Discover Your Perfect Stay
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose from our carefully curated selection of premium accommodations designed for your comfort
                        </p>
                        <div className="mt-6 inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-gray-700 font-medium">
                                {availableRooms.length} rooms available for booking
                            </span>
                        </div>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Rooms Available</h2>
                            <p className="text-gray-600 text-lg mb-8">Please check back later for available rooms.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-hotel-600 text-white px-8 py-3 rounded-lg hover:bg-hotel-700 transition-colors duration-200"
                            >
                                Return Home
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rooms.map((room) => (
                                <div key={room.id} className="group">
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                                        {/* Room Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img 
                                                src={getRoomImage(room.type)} 
                                                alt={room.type}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            
                                            {/* Status Badge */}
                                            {!room.available ? (
                                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                                    Booked
                                                </div>
                                            ) : (
                                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                                    Available
                                                </div>
                                            )}
                                            
                                            {/* Price */}
                                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                                <div className="flex items-center">
                                                    <CurrencyDollarIcon className="w-4 h-4 text-hotel-600 mr-1" />
                                                    <span className="text-xl font-bold text-gray-900">{room.price}</span>
                                                    <span className="text-gray-600 ml-1">/night</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Room Details */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-bold text-gray-900">{room.type}</h3>
                                                <div className="flex items-center">
                                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                                    <span className="text-sm text-gray-600">4.8</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4">
                                                Room {room.roomNumber} • Perfect for your stay
                                            </p>

                                            {/* Amenities */}
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {getRoomAmenities(room.type).slice(0, 4).map((amenity, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 bg-hotel-100 text-hotel-700 text-xs rounded-full">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {room.available ? (
                                                <Link
                                                    to={`/book-room/${room.id}`}
                                                    className="w-full bg-hotel-600 text-white py-3 px-4 rounded-lg hover:bg-hotel-700 transition-colors duration-200 flex items-center justify-center group"
                                                >
                                                    <EyeIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    View Details & Book
                                                </Link>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
                                                >
                                                    Currently Booked
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Single room booking form
    return (
        <div className="min-h-screen bg-gradient-to-br from-hotel-50 to-hotel-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-hotel-600 hover:text-hotel-700 mb-6 transition-colors duration-200 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Rooms
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Stay</h1>
                    <p className="text-gray-600">Complete your booking for a memorable experience</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Room Details */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="relative h-64">
                            <img 
                                src={getRoomImage(room.type)} 
                                alt={room.type}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                <div className="flex items-center">
                                    <CurrencyDollarIcon className="w-4 h-4 text-hotel-600 mr-1" />
                                    <span className="text-xl font-bold text-gray-900">{room.price}</span>
                                    <span className="text-gray-600 ml-1">/night</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{room.type}</h2>
                            <p className="text-gray-600 mb-6">Room {room.roomNumber}</p>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {getRoomAmenities(room.type).map((amenity, index) => (
                                        <div key={index} className="flex items-center text-gray-600">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Date
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="checkInDate"
                                            value={formData.checkInDate}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-hotel-500 focus:border-transparent transition-colors ${
                                                errors.checkInDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.checkInDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Date
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="checkOutDate"
                                            value={formData.checkOutDate}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-hotel-500 focus:border-transparent transition-colors ${
                                                errors.checkOutDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.checkOutDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Guest Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Name
                                    </label>
                                    <input
                                        type="text"
                                        name="guestName"
                                        value={formData.guestName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-hotel-500 focus:border-transparent transition-colors ${
                                            errors.guestName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter guest name"
                                    />
                                    {errors.guestName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.guestName}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Email
                                    </label>
                                    <input
                                        type="email"
                                        name="guestEmail"
                                        value={formData.guestEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-hotel-500 focus:border-transparent transition-colors ${
                                            errors.guestEmail ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter guest email"
                                    />
                                    {errors.guestEmail && (
                                        <p className="text-red-500 text-sm mt-1">{errors.guestEmail}</p>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hotel-500 focus:border-transparent transition-colors"
                                    placeholder="Any special requests or preferences..."
                                />
                            </div>

                            {/* Price Summary */}
                            {formData.checkInDate && formData.checkOutDate && (
                                <div className="bg-hotel-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Room rate per night:</span>
                                            <span className="font-medium">${room.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Number of nights:</span>
                                            <span className="font-medium">
                                                {Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))}
                                            </span>
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between text-lg font-bold text-hotel-600">
                                                <span>Total:</span>
                                                <span>${calculateTotalPrice()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-hotel-600 text-white py-4 px-6 rounded-lg hover:bg-hotel-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold text-lg flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HeartIcon className="w-5 h-5 mr-2" />
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomBookingPage; 