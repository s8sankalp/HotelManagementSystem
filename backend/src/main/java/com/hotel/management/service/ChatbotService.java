package com.hotel.management.service;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public String getResponse(String message) {
        String lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.contains("book")) {
            return "You can book a room by navigating to our booking page. Would you like me to redirect you?";
        } else if (lowerCaseMessage.contains("check-in") || lowerCaseMessage.contains("checkin")) {
            return "Check-in time is from 2:00 PM onwards.";
        } else if (lowerCaseMessage.contains("cancel")) {
            return "You can cancel your booking from your customer dashboard. You will need to be logged in.";
        } else if (lowerCaseMessage.contains("help") || lowerCaseMessage.contains("support")) {
            return "For any assistance, you can contact our support team at support@hotel.com.";
        } else if (lowerCaseMessage.contains("hello") || lowerCaseMessage.contains("hi")) {
            return "Hello! How can I help you today?";
        } else {
            return "I'm sorry, I didn't understand that. You can ask me about booking, check-in, or cancellation policies.";
        }
    }
} 