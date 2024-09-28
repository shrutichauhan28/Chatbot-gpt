import React, { useState, useEffect, useRef } from 'react';
import { queryAPI } from './api';
import Message from './Message';
import { IoSend } from "react-icons/io5";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session-id');
  const messagesEndRef = useRef(null);  // Scroll reference for new messages

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages([...messages, userMessage]);

      const response = await queryAPI(sessionId, input);
      const botMessage = { sender: 'bot', text: response.answer };

      setMessages([...messages, userMessage, botMessage]);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div class="encloser">
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
