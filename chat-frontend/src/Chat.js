import React, { useState, useEffect, useRef } from 'react';
import { queryAPI } from './api';
import Message from './Message';
import { IoSend } from "react-icons/io5";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session-id');
  const [isTyping, setIsTyping] = useState(false); // Handle typing state
  const [botMessage, setBotMessage] = useState(''); // Track the ongoing bot message for typewriter effect
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle typewriter effect
  const typeWriterEffect = (text, index = 0) => {
    if (index < text.length) {
      setBotMessage((prev) => prev + text.charAt(index)); // Incrementally add the next character
      setTimeout(() => typeWriterEffect(text, index + 1), 30); // Adjust typing speed here
    } else {
      setIsTyping(false); // Stop typing animation
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: text }]); // Append the full message
      setBotMessage(''); // Clear the botMessage
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      setIsTyping(true); // Start the typing effect
      const response = await queryAPI(sessionId, input);

      // Trigger typewriter effect for bot response
      setBotMessage(''); // Clear any previous bot message before starting typewriter
      typeWriterEffect(response.answer);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {isTyping && <Message sender="bot" text={botMessage} />} {/* Show typing message only */}
        <div ref={messagesEndRef} />
      </div>
      <div className="encloser">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          />
          <button onClick={sendMessage}><IoSend /></button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
