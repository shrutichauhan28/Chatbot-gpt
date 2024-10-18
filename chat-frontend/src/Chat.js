import React, { useState, useEffect, useRef } from 'react';
import { queryAPI } from './api';
import Message from './Message';
import Skull from './Skull';
import { IoSend } from "react-icons/io5";


function Chat({ sessionId }) {  // Accept sessionId as a prop
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Handle loading state
  const [conversationStarted, setConversationStarted] = useState(false);  // Track if the conversation has started
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start the conversation and show the initial bot message
  const startConversation = () => {
    const initialBotMessage = {
      sender: 'bot',
      text: "Hello and welcome to Yugm 🚀 I'm here to answer and help you with anything related to the company. Let us work together to find the information you need!"
    };
    setMessages([initialBotMessage]);  // Initialize with the bot's message
    setConversationStarted(true);  // Mark conversation as started
  };

  // This effect is triggered when the sessionId changes, resetting the messages
  useEffect(() => {
    if (sessionId) {
      setMessages([]);  // Clear messages when a new session starts
      setConversationStarted(false);  // Reset conversation state
    }
  }, [sessionId]);

  // Trigger send message
  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');  // Clear input after sending
      setIsLoading(true);  // Start skeleton loader

      // Send user message to API
      const response = await queryAPI(sessionId, input);

      // Append bot's response after user's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.answer },  // Append bot response
      ]);

      setIsLoading(false);  // Stop skeleton loader
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading && <Skull />}  {/* Show skull skeleton loader when loading */}
        <div ref={messagesEndRef} />
      </div>

      {!conversationStarted ? (
        <div className="start-conversation">
          <div>
            <img src="/images/astro.gif" alt="astro" className='m-auto justify-center' />
          </div>
          <div className="placeholder-text">
            Ask YUGM about the Knowledge Base
          </div>
          <button onClick={startConversation} className="start-button">
            Start Conversation 🎊
          </button>
        </div>
      ) : (
        <div className="encloser fade-in">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Generating Response..." : "Ask a Question..."}  // Conditional placeholder
              onKeyPress={(e) => e.key === 'Enter' && !isLoading ? sendMessage() : null}
              disabled={isLoading}  // Disable input while loading
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>  // Loader while sending
              ) : (
                <IoSend className="send-icon" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
