package com.hotel.management.service;

import com.hotel.management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    @Autowired
    private RoomRepository roomRepository;

    public String getResponse(String message) {
        String lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.contains("available") || lowerCaseMessage.contains("rooms") || lowerCaseMessage.contains("how many")) {
            long availableRooms = roomRepository.countByIsAvailableTrue();
            long totalRooms = roomRepository.count();
            
            if (availableRooms > 0) {
                return String.format("We currently have %d rooms available out of %d total rooms. You can view and book available rooms on our booking page. Would you like me to help you with anything else?", availableRooms, totalRooms);
            } else {
                return "Unfortunately, all rooms are currently booked. Please check back later for availability or contact us for assistance.";
            }
        } else if (lowerCaseMessage.contains("book") || lowerCaseMessage.contains("booking")) {
            return "You can book a room by navigating to our booking page. We offer Standard Rooms ($100/night), Deluxe Rooms ($150/night), and Suites ($250/night). Would you like me to redirect you to the booking page?";
        } else if (lowerCaseMessage.contains("check-in") || lowerCaseMessage.contains("checkin")) {
            return "Check-in time is from 2:00 PM onwards. Check-out time is 11:00 AM. Early check-in and late check-out can be arranged based on availability.";
        } else if (lowerCaseMessage.contains("check-out") || lowerCaseMessage.contains("checkout")) {
            return "Check-out time is 11:00 AM. Late check-out can be arranged based on availability. Please contact our front desk for arrangements.";
        } else if (lowerCaseMessage.contains("cancel") || lowerCaseMessage.contains("cancellation")) {
            return "You can cancel your booking from your customer dashboard. Cancellations must be made at least 24 hours before check-in. You will need to be logged in to manage your bookings.";
        } else if (lowerCaseMessage.contains("price") || lowerCaseMessage.contains("cost") || lowerCaseMessage.contains("rate")) {
            return "Our room rates are: Standard Room - $100/night, Deluxe Room - $150/night, and Suite - $250/night. All rates are subject to availability and may vary during peak seasons.";
        } else if (lowerCaseMessage.contains("amenities") || lowerCaseMessage.contains("facilities")) {
            return "Our rooms include WiFi, TV, AC, and private bathrooms. Deluxe rooms also feature mini bars and city views, while suites include balconies and room service.";
        } else if (lowerCaseMessage.contains("help") || lowerCaseMessage.contains("support")) {
            return "For any assistance, you can contact our support team at support@hotel.com or call us at +1-555-0123. Our staff is available 24/7 to help you.";
        } else if (lowerCaseMessage.contains("hello") || lowerCaseMessage.contains("hi") || lowerCaseMessage.contains("hey")) {
            return "Hello! I'm your hotel assistant. I can help you with booking rooms, checking availability, room rates, amenities, and more. How can I assist you today?";
        } else if (lowerCaseMessage.contains("thank")) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (lowerCaseMessage.contains("bye") || lowerCaseMessage.contains("goodbye")) {
            return "Thank you for choosing our hotel! Have a wonderful day and feel free to reach out if you need anything else.";
        } else {
            return "I'm sorry, I didn't understand that. You can ask me about room availability, booking, check-in/check-out times, prices, amenities, or cancellation policies. How can I help you?";
        }
    }
} 