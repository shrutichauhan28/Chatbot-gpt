import React, { useState } from 'react';
import { queryAPI } from './api';
import Message from './Message';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session-id'); // Use a unique session id or generate one
  
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
      </div>
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message..." 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
