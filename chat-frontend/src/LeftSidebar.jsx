// LeftSidebar.js
import React from 'react';
import { BiMessageAlt } from "react-icons/bi";
import { CiSaveUp2 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import './LeftSidebar.css';

const LeftSidebar = ({ isLeftSidebarOpen }) => {
  return (
    <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
      <button className="btn btn-gradient-border btn-glow">
        <BiMessageAlt />New Chat
      </button>
      <button className="btn btn-gradient-border btn-glow">
        <CiSaveUp2 />Saved
      </button>
      <button className="btn btn-gradient-border btn-glow">
        <BsClockHistory />History
      </button>
    </aside>
  );
};

export default LeftSidebar;
