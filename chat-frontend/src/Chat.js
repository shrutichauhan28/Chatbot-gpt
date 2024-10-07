import React, { useState, useEffect, useRef } from 'react';
import { queryAPI } from './api';
import Message from './Message';
import Skull from './Skull'; // Import your skeleton loader
import { IoSend } from "react-icons/io5";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session-id');
  const [isLoading, setIsLoading] = useState(false); // Handle loading state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Trigger send message
  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput(''); // Clear input after sending
      setIsLoading(true); // Start skeleton loader

      const response = await queryAPI(sessionId, input);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.answer }, // Append bot response
      ]);

      setIsLoading(false); // Stop skeleton loader
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading && <Skull />} {/* Show skull skeleton loader when loading */}
        <div ref={messagesEndRef} />
      </div>
      <div className="encloser">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Generating Response..." : "Ask a Question..."} // Conditional placeholder
            onKeyPress={(e) => e.key === 'Enter' && !isLoading ? sendMessage() : null}
            disabled={isLoading} // Disable input while loading
          />
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? (
              <div className="loader"></div> // Loader while sending
            ) : (
              <IoSend className="send-icon" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
