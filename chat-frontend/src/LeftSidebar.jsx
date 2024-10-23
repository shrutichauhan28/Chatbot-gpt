import React, { useEffect, useState } from 'react';
import { BiMessageAlt, BiBookmark } from "react-icons/bi";
import { BsClockHistory } from "react-icons/bs";
import { getLastChatSessions } from './api'; // Import the API function to fetch sessions
import './LeftSidebar.css';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal'; // Import the Modal component

const LeftSidebar = ({ isLeftSidebarOpen, handleNewChat }) => {
  const [chatHistory, setChatHistory] = useState([]);  // State for chat history
  const [selectedSession, setSelectedSession] = useState(null); // State for selected session
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getLastChatSessions(); // Call API to fetch chat sessions
        setChatHistory(response.sessions);  // Update state with chat history
      } catch (error) {
        console.error("Error fetching chat history: ", error);
      }
    };

    fetchChatHistory();
  }, []);

  // Effect to manage the body class for the modal blur
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open'); // Add class to body
    } else {
      document.body.classList.remove('modal-open'); // Remove class from body
    }
  }, [isModalOpen]); // Run this effect when isModalOpen changes

  const handleNewChatClick = () => {
    const newSessionId = uuidv4();  // Generate a new session ID
    handleNewChat(newSessionId);  // Pass the new session ID back to parent
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session); // Set the selected session
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedSession(null); // Clear selected session
  };

  return (
    <>
      <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
        <button className="glow-on-hover" onClick={handleNewChatClick}>
          <BiMessageAlt /> New Chat
        </button>
        <button className="glow-on-hover">
          <BiBookmark /> Saved
        </button>
        <button className="glow-on-hover">
          <BsClockHistory /> History
        </button>

        {/* Display chat history */}
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <p>No chat history available</p>
          ) : (
            <ul>
              {chatHistory.map((session, index) => (
                <li key={index}>
                  <button onClick={() => handleSessionClick(session)} className="chat-history-item">
                    {session.conversations[0].data.content} {/* Display the first conversation */}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Modal to display selected session */}
      {isModalOpen && (
        <Modal session={selectedSession} onClose={closeModal} />
      )}
    </>
  );
};

export default LeftSidebar;
