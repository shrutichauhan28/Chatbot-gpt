import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import './App.css';

function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setRightSidebarOpen(false); // Collapse right sidebar on small screens
      setRightSidebarCollapsed(true);
    } else {
      setRightSidebarOpen(true); // Expand right sidebar on larger screens
      setRightSidebarCollapsed(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Company CHATBOT</h1>
        </div>
        <div className="navbar-right">
          <button>Chat</button>
          <button>Saved</button>
          <button>History</button>
          <button className="toggle-left-sidebar" onClick={toggleLeftSidebar}>
            {isLeftSidebarOpen ? 'Hide Left' : 'Show Left'}
          </button>
          <button className="toggle-right-sidebar" onClick={toggleRightSidebar}>
            {isRightSidebarOpen ? 'Hide Right' : 'Show Right'}
          </button>
        </div>
      </nav>

      <div className="content">
        {/* Left Sidebar */}
        {isLeftSidebarOpen && (
          <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
            <button>New Chat</button>
            <button>Saved</button>
            <button>History</button>
            <button>Logout</button>
          </aside>
        )}

        {/* Main Chat Section */}
        <main className="chat-main">
          <Chat />
        </main>

        {/* Right Sidebar (Collapsible) */}
        {isRightSidebarOpen && (
          <aside className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}>
            <h2>Generated Links of Websites and Documents</h2>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
