import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RoomBookingPage from './pages/RoomBookingPage';
import ViewBookingsPage from './pages/ViewBookingsPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/rooms/available" element={<RoomBookingPage />} />
            <Route path="/book-room/:id" element={<RoomBookingPage />} />
            <Route path="/my-bookings" element={<ViewBookingsPage />} />
            <Route path="/admin/rooms" element={<AdminRoomsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Routes>
        </main>
        <Chatbot />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
