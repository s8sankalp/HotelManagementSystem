package com.hotel.management.controller;

import com.hotel.management.dto.ChatbotRequest;
import com.hotel.management.dto.ChatbotResponse;
import com.hotel.management.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ChatbotResponse chat(@RequestBody ChatbotRequest chatbotRequest) {
        String reply = chatbotService.getResponse(chatbotRequest.getMessage());
        return new ChatbotResponse(reply);
    }
} 