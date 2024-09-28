// RightSidebar.js
import React from 'react';
import './RightSidebar.css';

const RightSidebar = ({ isRightSidebarOpen, isRightSidebarCollapsed }) => {
  return (
    <aside className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}>
      <h2>Generated Links of Websites and Documents</h2>
      {/* Add your content here */}
    </aside>
  );
};

export default RightSidebar;
