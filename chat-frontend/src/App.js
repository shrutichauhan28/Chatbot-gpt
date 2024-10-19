import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating session IDs

function App() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatSessions, setChatSessions] = useState([]); // Track all chat sessions

  const navigate = useNavigate();
  const location = useLocation();


  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const checkScreenSize = () => {
    if (window.innerWidth < 900) {
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
    const queryParams = new URLSearchParams(window.location.search);
    const oauthToken = queryParams.get('token');
    
    if (oauthToken) {
      localStorage.setItem('token', oauthToken);
      fetchUserInfo(oauthToken); // Fetch user info with the OAuth token
      navigate('/'); // Redirect to home or dashboard
    } else if (token) {
      fetchUserInfo(token); // Fetch user info with stored token
    } else {
      setUserInfo({ username: '', role: '' });
      setIsLoggedIn(false);
    }
  
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate]);

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

  //Handle starting a new chat session
  const handleNewChat = () => {
    const newSessionId = uuidv4(); // Generate a new session ID
    setChatSessions([...chatSessions, newSessionId]); // Add session to state
    navigate(`/chat/${newSessionId}`); // Navigate to the new chat
  };

  const handleSignupSuccess = () => {
    toast.success("Successfully registered! Please log in.");
  };

  const handleLoginSuccess = () => {
    toast.success("Successfully logged in!");
  };

  const isChatPath = location.pathname.startsWith('/chat');
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`app-container ${isLoginPage ? 'login-page' : ''}`}>
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
           <LeftSidebar 
           isLeftSidebarOpen={isLeftSidebarOpen}
           handleNewChat={handleNewChat}  // Pass handleNewChat as a prop
         />
        )}
  
        <main className={`chat-main ${isLeftSidebarOpen ? '' : 'expanded-chat'}`}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigate to={`/chat/${uuidv4()}`} /> {/* Redirect to a new chat */}
              </ProtectedRoute>
            } />
            <Route path="/chat/:sessionId" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<Signup handleSignupSuccess={handleSignupSuccess} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} handleLoginSuccess={handleLoginSuccess} />} />
            <Route path="/settings" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Settings /></ProtectedRoute>} />
            <Route path="/addusers" element={<ProtectedRoute isLoggedIn={isLoggedIn}><AddUsers /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all route */}
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );  
}

export default App;
