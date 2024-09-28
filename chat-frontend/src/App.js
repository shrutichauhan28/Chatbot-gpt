import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Chat from './Chat';
import ProfileDropdown from './ProfileDropdown';
import Signup from './Signup';
import Login from './Login';
import Settings from './Settings'; // Import the Settings component
import './App.css';
import { BiMessageAlt } from "react-icons/bi";
import { CiSaveUp2 } from "react-icons/ci";
import { BsClockHistory } from "react-icons/bs";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isRightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

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

    // Clear user info state
    setUserInfo({ username: '', role: '' });
    setIsLoggedIn(false);

    // Redirect to login page
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

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="title">
            <h1>YUGM</h1>
          </div>
        </div>
        <div className="navbar-right">
          {/* Pass userInfo and handleLogout as props */}
          {isLoggedIn && (
            <ProfileDropdown userInfo={userInfo} handleLogout={handleLogout} />
          )}
          {!isLoggedIn ? (
            <>
              {/* Define routes */}
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

      <div className="content">
        {isLeftSidebarOpen && (
          <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
            <button className="btn btn-gradient-border btn-glow"><BiMessageAlt />New Chat</button>
            <button className="btn btn-gradient-border btn-glow"><CiSaveUp2 />Saved</button>
            <button className="btn btn-gradient-border btn-glow"><BsClockHistory />History</button>
          </aside>
        )}

        <main className="chat-main">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />} />
            <Route path="/settings" element={<Settings />} /> {/* Add route for Settings */}
          </Routes>
        </main>

        {isRightSidebarOpen && (
          <aside className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}>
            <h2>Generated Links of Websites and Documents</h2>
          </aside>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
