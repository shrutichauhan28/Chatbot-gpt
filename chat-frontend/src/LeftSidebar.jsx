// LeftSidebar.js
import React from 'react';
import { BiMessageAlt, BiBookmark } from "react-icons/bi";
// import { CiSaveUp1 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import './LeftSidebar.css';

const LeftSidebar = ({ isLeftSidebarOpen }) => {
  return (
    <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
      <button className="glow-on-hover">
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
