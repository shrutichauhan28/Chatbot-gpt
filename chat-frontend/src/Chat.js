import React, { useState, useEffect, useRef } from 'react';
import { queryAPI } from './api';  // Ensure this sends data to the backend
import SuggestionCard from './SuggestionCard';
import ChatGreeting from './ChatGreeting';
import Message from './Message';
import Skull from './Skull';
import { IoSend } from "react-icons/io5";

const suggestions = [
  { id: 1, text: 'Can I carry over unused vacation days to the next year?', icon: '📊' },
  { id: 2, text: 'What is the company’s policy on unpaid leave?', icon: '📋' },
  { id: 3, text: 'How do I apply for sick leave?', icon: '📞' },
  { id: 4, text: 'Help me understand the training programs available for new employees.', icon: '🎓' }
];

function Chat({ sessionId, userInfo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async (starterMessage = null) => {
    const initialBotMessage = {
      sender: 'bot',
      text: "Hello and welcome to Yugm 🚀 I'm here to assist you with all your company-related queries. Let’s dive into knowledge and insights to enhance your productivity!"
    };

    const newMessages = [initialBotMessage];
    if (starterMessage) {
      const userMessage = { sender: 'user', text: starterMessage };
      newMessages.push(userMessage);
    }
    setMessages(newMessages);
    setConversationStarted(true);

    if (starterMessage) {
      setIsLoading(true);
      try {
        const response = await queryAPI(sessionId, starterMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: response.answer },
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (input.trim() && !isLoading && !isMessageSent) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setIsLoading(true);
      setIsMessageSent(true);

      try {
        const response = await queryAPI(sessionId, input);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: response.answer },
        ]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
        ]);
      } finally {
        setIsLoading(false);
        setIsMessageSent(false);
      }
    }
  };

  return (
    <div className="chat-container" aria-live="polite" aria-atomic="true">
      <div className={`messages ${isLoading ? 'loading' : ''}`}>
  {messages.map((msg, index) => (
    <Message key={index} sender={msg.sender} text={msg.text} />
  ))}
  {isLoading && (
    <Message key="loading" sender="bot" text={<Skull />} />
  )}
  <div ref={messagesEndRef} />
</div>
      {!conversationStarted ? (
        <div className="start-conversation">
          <ChatGreeting userInfo={userInfo} />
          <div>
            <img src="/images/astro.gif" alt="astro" className="m-auto justify-center small-gif" />
          </div>
          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-card"
                onClick={() => startConversation(suggestion.text)}
              >
                <div className="icon">{suggestion.icon}</div>
                <div className="text">{suggestion.text}</div>
              </div>
            ))}
          </div>
          <button onClick={() => startConversation()} className="start-button">
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
              placeholder={isLoading ? "Generating Response..." : "Ask a Question..."}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading ? sendMessage() : null}
              aria-label="Chat Input"
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>
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
