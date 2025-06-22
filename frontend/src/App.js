import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/book-room/:id" element={<RoomBookingPage />} />
          <Route path="/my-bookings" element={<ViewBookingsPage />} />
          <Route path="/admin/rooms" element={<AdminRoomsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Routes>
      </div>
      <Chatbot />
    </Router>
  );
}

export default App;
