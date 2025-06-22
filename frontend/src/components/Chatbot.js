import React, { useState } from 'react';
import api from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);
            setInput('');
            try {
                const response = await api.chat(input);
                setMessages([...newMessages, { text: response.data.reply, sender: 'bot' }]);
            } catch (error) {
                setMessages([...newMessages, { text: 'Error connecting to the chatbot.', sender: 'bot' }]);
            }
        }
    };

    if (!isOpen) {
        return <button onClick={toggleChat}>Chat</button>;
    }

    return (
        <div className="chatbot">
            <div className="chatbot-header">
                <h2>Chatbot</h2>
                <button onClick={toggleChat}>Close</button>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot; 