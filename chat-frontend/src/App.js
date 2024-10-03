import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Chat from './Chat';
import Signup from './Signup';
import Login from './Login';
import Settings from './Settings';
import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUsers from './AddUsers';
import ProtectedRoute from './ProtectedRoute';

//manages the application's layout, navigation, and user authentication, rendering different pages and sidebars based on the user's login status and screen size
function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const checkScreenSize = () => {
    if (window.innerWidth < 768) {
      setLeftSidebarOpen(false);
    } else {
      setLeftSidebarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserInfo({ username: '', role: '' });
    setIsLoggedIn(false);
    toast.success("Successfully logged out!");
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

  // Define handleSignupSuccess function
  const handleSignupSuccess = () => {
    toast.success("Successfully registered! Please log in.");
  };

  // Define handleLoginSuccess function
  const handleLoginSuccess = () => {
    toast.success("Successfully logged in!");
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
      />

      <div className="content">
        {isChatPath && isLeftSidebarOpen && (
          <LeftSidebar isLeftSidebarOpen={isLeftSidebarOpen} />
        )}

        <main className="chat-main">
          <Routes>
            {/* <Route path="/" element={<Chat />} /> */}
            <Route path="/" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<Signup handleSignupSuccess={handleSignupSuccess} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} handleLoginSuccess={handleLoginSuccess} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/addusers" element={<AddUsers/>}/>
          </Routes>
        </main>
      </div>
      <ToastContainer /> {/* Include the ToastContainer here */}
    </div>
  );
}

export default App;
