import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm your hotel assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "How many rooms are available?",
        "What are the room rates?",
        "What are the check-in times?",
        "How do I cancel a booking?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (messageText = input) => {
        if (messageText.trim() && !isLoading) {
            const userMessage = { text: messageText, sender: 'user', timestamp: new Date() };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await api.chat(messageText);
                const botMessage = { 
                    text: response.data.reply, 
                    sender: 'bot', 
                    timestamp: new Date() 
                };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                console.error('Chatbot error:', error);
                const errorMessage = { 
                    text: 'Sorry, I\'m having trouble connecting right now. Please try again later.', 
                    sender: 'bot', 
                    timestamp: new Date() 
                };
                setMessages(prev => [...prev, errorMessage]);
                toast.error('Failed to send message');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) {
        return (
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-hotel-600 to-hotel-700 hover:from-hotel-700 hover:to-hotel-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-pulse"
                aria-label="Open chat"
            >
                <ChatBubbleLeftRightIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-hotel-600 to-hotel-700 text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Hotel Assistant</h3>
                        <p className="text-xs text-hotel-100 flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            Online • Ready to help
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleChat}
                    className="text-white hover:text-hotel-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                    aria-label="Close chat"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                message.sender === 'user' 
                                    ? 'bg-gradient-to-r from-hotel-600 to-hotel-700 text-white ml-3' 
                                    : 'bg-white text-hotel-600 mr-3 border-2 border-hotel-200'
                            }`}>
                                {message.sender === 'user' ? (
                                    <UserIcon className="w-5 h-5" />
                                ) : (
                                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                )}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                message.sender === 'user'
                                    ? 'bg-gradient-to-r from-hotel-600 to-hotel-700 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                <p className={`text-xs mt-2 ${
                                    message.sender === 'user' ? 'text-hotel-100' : 'text-gray-500'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex max-w-xs lg:max-w-md">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-hotel-600 mr-3 border-2 border-hotel-200 flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </div>
                            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Questions */}
                {messages.length === 1 && !isLoading && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSend(question)}
                                    className="text-xs bg-hotel-100 text-hotel-700 px-3 py-2 rounded-full hover:bg-hotel-200 transition-colors duration-200 border border-hotel-200"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about our hotel..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-transparent text-sm pr-12"
                            disabled={isLoading}
                        />
                        <QuestionMarkCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-3 bg-gradient-to-r from-hotel-600 to-hotel-700 hover:from-hotel-700 hover:to-hotel-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};

export default Chatbot; 