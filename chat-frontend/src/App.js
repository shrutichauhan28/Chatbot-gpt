import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Chat from './Chat';
import ProfileDropdown from './ProfileDropdown';
import Signup from './Signup';
import Login from './Login';
import './App.css';
import { BiMessageAlt } from "react-icons/bi";
import { CiSaveUp2 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import { LiaSignOutAltSolid } from "react-icons/lia";
 
function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [isUserInfoVisible, setUserInfoVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setUserInfo({ username: '', role: '' }); // Reset user info
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token); // Fetch dynamic user info
    }
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/userInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User Info:', data.user); // Log the user info
        if (data.user) {
          setUserInfo({ username: data.user.username, role: data.user.role });
        } else {
          console.error('User data missing from response.');
          setIsLoggedIn(false);
        }
      } else {
        const errorMsg = await response.text(); // Get detailed error message
        console.error('Failed to fetch user info:', errorMsg);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="title">
            <h1>YUGM</h1>
          </div>
        </div>
        <div className="navbar-right">
          { <ProfileDropdown userInfo={userInfo} handleLogout={handleLogout} />} {/* Display dropdown only when logged in */}
          {!isLoggedIn ? (
            <>
              <Link to="/signup">
                <button className="btn btn-gradient-border btn-glow">Signup</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-gradient-border btn-glow">Login</button>
              </Link>
            </>
          ) : (
            <button className="btn btn-gradient-border btn-glow" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {isUserInfoVisible && (
        <div className="user-info">
          <span>{userInfo.username}</span>
          <span> - {userInfo.role}</span>
        </div>
      )}

      <div className="content">
        {/* Left Sidebar */}
        {isLeftSidebarOpen && (
          <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
            <button className="btn btn-gradient-border btn-glow"><BiMessageAlt />New Chat</button>
            <button className="btn btn-gradient-border btn-glow"><CiSaveUp2 />Saved</button>
            <button className="btn btn-gradient-border btn-glow"><BsClockHistory />History</button>
            {isLoggedIn && (
              <button className="btn btn-gradient-border btn-glow" onClick={handleLogout}>
                <LiaSignOutAltSolid /> Logout
              </button>
            )}
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
  );
}

export default App;
