import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    // Auth
    login: (credentials) => apiClient.post('/auth/signin', credentials),
    signup: (userInfo) => apiClient.post('/auth/signup', userInfo),

    // Rooms
    getRooms: () => apiClient.get('/rooms'),
    getRoomById: (id) => apiClient.get(`/rooms/${id}`),
    getAvailableRooms: () => apiClient.get('/rooms/available'),
    addRoom: (room) => apiClient.post('/rooms', room),
    updateRoom: (id, room) => apiClient.put(`/rooms/${id}`, room),
    deleteRoom: (id) => apiClient.delete(`/rooms/${id}`),

    // Bookings
    createBooking: (booking) => apiClient.post('/bookings', booking),
    getMyBookings: () => apiClient.get('/bookings/my-bookings'),
    cancelBooking: (id) => apiClient.delete(`/bookings/${id}`),
    getAllBookings: () => apiClient.get('/bookings'),

    // Chatbot
    chat: (message) => apiClient.post('/chatbot', { message })
}; 