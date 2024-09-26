import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import React Router components
import Chat from './Chat';
import ProfileDropdown from './ProfileDropdown';
import Signup from './Signup';
import Login from './Login';
import './App.css';

function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [isUserInfoVisible, setUserInfoVisible] = useState(false); 
  const [userInfo] = useState({ name: 'John Doe', role: 'Admin' });

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleUserInfo = () => {
    setUserInfoVisible(!isUserInfoVisible);
  };

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setRightSidebarOpen(false);
      setRightSidebarCollapsed(true);
    } else {
      setRightSidebarOpen(true);
      setRightSidebarCollapsed(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-left">
            <h1>YUGM</h1>
          </div>
          <div className="navbar-right">
           
            {/* Profile Dropdown Component */}
            <ProfileDropdown />

            {/* Link to Signup Page */}
            <Link to="/signup">
              <button className="signup-link">Signup</button>
            </Link>
              {/* Link to Login Page */}
              <Link to="/login">
              <button className="login-link">Login</button>
            </Link>
          </div>
        </nav>

        {isUserInfoVisible && (
          <div className="user-info">
            <span>{userInfo.name}</span>
            <span> - {userInfo.role}</span>
          </div>
        )}

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

          {/* Main Chat Section or Routes */}
          <main className="chat-main">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} /> 
            </Routes>
          </main>

          {/* Right Sidebar (Collapsible) */}
          {isRightSidebarOpen && (
            <aside className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}>
              <h2>Generated Links of Websites and Documents</h2>
            </aside>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
