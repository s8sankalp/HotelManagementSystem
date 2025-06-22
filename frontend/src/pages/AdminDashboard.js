import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  UserGroupIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRooms: 0,
        totalBookings: 0,
        totalRevenue: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        pendingBookings: 0,
        confirmedBookings: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all necessary data for admin dashboard
            const [usersRes, roomsRes, bookingsRes] = await Promise.all([
                api.getUsers(),
                api.getRooms(),
                api.getAllBookings()
            ]);
            
            const users = usersRes.data || [];
            const rooms = roomsRes.data || [];
            const bookings = bookingsRes.data || [];
            
            // Calculate statistics
            const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
            const availableRooms = rooms.filter(room => room.available).length;
            const occupiedRooms = rooms.filter(room => !room.available).length;
            const pendingBookings = bookings.filter(booking => booking.status === 'PENDING').length;
            const confirmedBookings = bookings.filter(booking => booking.status === 'CONFIRMED').length;
            
            setStats({
                totalUsers: users.length,
                totalRooms: rooms.length,
                totalBookings: bookings.length,
                totalRevenue,
                availableRooms,
                occupiedRooms,
                pendingBookings,
                confirmedBookings
            });
            
            setRecentBookings(bookings.slice(0, 5));
            
        } catch (error) {
            console.error('Error fetching admin dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const dashboardStats = [
        {
            name: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: '+12%',
            changeType: 'positive'
        },
        {
            name: 'Total Rooms',
            value: stats.totalRooms,
            icon: BuildingOfficeIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: '+5%',
            changeType: 'positive'
        },
        {
            name: 'Total Bookings',
            value: stats.totalBookings,
            icon: CalendarIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: '+23%',
            changeType: 'positive'
        },
        {
            name: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: CurrencyDollarIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: '+18%',
            changeType: 'positive'
        }
    ];

    const quickActions = [
        {
            name: 'Add New Room',
            description: 'Create a new room listing',
            icon: PlusIcon,
            href: '/admin/rooms',
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Manage Users',
            description: 'View and manage user accounts',
            icon: UserGroupIcon,
            href: '/admin/users',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'View Bookings',
            description: 'Monitor all hotel bookings',
            icon: CalendarIcon,
            href: '/admin/bookings',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            name: 'System Settings',
            description: 'Configure hotel settings',
            icon: CogIcon,
            href: '/admin/settings',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
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
                    Admin Dashboard
                </h1>
                <p className="text-gray-600">
                    Manage your hotel operations and monitor performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className="card-hover">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-medium ${
                                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickActions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.href}
                        className="card-hover group"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                <action.icon className={`w-6 h-6 ${action.color}`} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-hotel-600 transition-colors">
                                    {action.name}
                                </h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Room Status and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Room Status */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="font-medium text-gray-900">Available Rooms</span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">{stats.availableRooms}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <span className="font-medium text-gray-900">Occupied Rooms</span>
                            </div>
                            <span className="text-2xl font-bold text-red-600">{stats.occupiedRooms}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="font-medium text-gray-900">Pending Bookings</span>
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</span>
                        </div>
                    </div>
                </div>

                {/* System Overview */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Occupancy Rate</span>
                            <span className="font-semibold text-gray-900">
                                {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-hotel-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stats.totalRooms > 0 ? (stats.occupiedRooms / stats.totalRooms) * 100 : 0}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Booking Success Rate</span>
                            <span className="font-semibold text-gray-900">
                                {stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stats.totalBookings > 0 ? (stats.confirmedBookings / stats.totalBookings) * 100 : 0}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Average Revenue per Booking</span>
                            <span className="font-semibold text-gray-900">
                                ${stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                    <Link
                        to="/admin/bookings"
                        className="text-hotel-600 hover:text-hotel-700 font-medium text-sm"
                    >
                        View all bookings →
                    </Link>
                </div>
                
                {recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Guest
                                    </th>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booking.userName || 'Guest'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.userEmail}
                                            </div>
                                        </td>
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-hotel-600 hover:text-hotel-900">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-500">Bookings will appear here once guests start making reservations</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 