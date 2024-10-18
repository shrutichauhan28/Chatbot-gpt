// LeftSidebar.js
import React from 'react';
import { BiMessageAlt, BiBookmark } from "react-icons/bi";
// import { CiSaveUp1 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import './LeftSidebar.css';
import { v4 as uuidv4 } from 'uuid';  // Add UUID generator


const LeftSidebar = ({ isLeftSidebarOpen,handleNewChat }) => {

  const handleNewChatClick = () => {
    const newSessionId = uuidv4();  // Generate a new session ID
    handleNewChat(newSessionId);  // Pass the new session ID back to parent
  };
  return (
    <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
      <button className="glow-on-hover" onClick={handleNewChatClick} >
        <BiMessageAlt /> New Chat
      </button>
      <button className="glow-on-hover">
        <BiBookmark /> Saved
      </button>
      <button className="glow-on-hover">
        <BsClockHistory /> History
      </button>
    </aside>
  );
};

export default LeftSidebar;
