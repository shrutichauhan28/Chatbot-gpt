import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Chat from './Chat';
import Signup from './Signup';
import Login from './Login';
import Settings from './Settings';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Navbar from './Navbar'; // Import Navbar component
import './App.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserInfo({ username: '', role: '' });
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      setUserInfo({ username: '', role: '' });
      setIsLoggedIn(false);
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      setUserInfo({ username: '', role: '' });

      const response = await fetch('http://localhost:5000/api/auth/userInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserInfo({ username: data.user.username, role: data.user.role });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const isChatPath = location.pathname === '/';

  return (
    <div className="app-container">
      <Navbar 
        isChatPath={isChatPath}
        isLeftSidebarOpen={isLeftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        handleLogout={handleLogout}
        isRightSidebarOpen={isRightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      />

      <div className="content">
        {isChatPath && isLeftSidebarOpen && (
          <LeftSidebar isLeftSidebarOpen={isLeftSidebarOpen} />
        )}

        <main className="chat-main">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        {isChatPath && isRightSidebarOpen && (
          <RightSidebar isRightSidebarOpen={isRightSidebarOpen} isRightSidebarCollapsed={isRightSidebarCollapsed} />
        )}
      </div>
    </div>
  );
}

export default App;
