import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Chat from './Chat';
import ProfileDropdown from './ProfileDropdown';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './Settings';
import { BiBookmark, BiHistory, BiPlus, BiUser, BiSolidUserCircle } from 'react-icons/bi';
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md';
import './App.css';
import './ProfileDropdown.css';

function AppContent() {
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

  // Get the current route path using useLocation
  const location = useLocation();

  // Check if the current route is the Settings page
  const isSettingsPage = location.pathname === '/settings';

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* Left Arrow Icon */}
          {!isSettingsPage && (
            <MdOutlineArrowLeft
              className="toggle-left-sidebar-icon"
              size={24}
              onClick={toggleLeftSidebar}
              title={isLeftSidebarOpen ? "Hide Left Sidebar" : "Show Left Sidebar"}
            />
          )}
          <h1 className="app-title">YUGM</h1> {/* Title aligned horizontally */}
        </div>

        <div className="navbar-right">
          {/* User and Organization Icons with Hover Popups */}
          <div className="navbar-icon user-icon" title="User">
            <BiSolidUserCircle size={24} />
          </div>

          <div className="navbar-icon org-icon" title="Organization">
            <BiUser size={24} />
          </div>

          {/* Add PopupWithTooltip next to User/Org icons */}
          <ProfileDropdown />  {/* This is the new popup component */}
          
          {/* Right Arrow Icon */}
          {!isSettingsPage && (
            <MdOutlineArrowRight
              className="toggle-right-sidebar-icon"
              size={24}
              onClick={toggleRightSidebar}
              title={isRightSidebarOpen ? "Hide Right Sidebar" : "Show Right Sidebar"}
            />
          )}
        </div>
      </nav>

      <div className="content">
        {/* Left Sidebar */}
        {!isSettingsPage && isLeftSidebarOpen && (
          <aside className={`left-sidebar ${!isLeftSidebarOpen ? 'collapsed' : ''}`}>
            <div className='sidebar-header' role='button'>
              <BiPlus size={20} />
              <button>New Chat</button>
            </div>
            <div className='sidebar-header' role='button'>
              <BiBookmark size={20} />
              <button>Saved Chat</button>
            </div>
            <div className='sidebar-header' role='button'>
              <BiHistory size={20} />
              <button>History</button>
            </div>
          </aside>
        )}

        {/* Main Chat Section */}
        <main className="chat-main">
          <Routes>
            <Route path="/" element={<Chat />} />  {/* Main Chat route */}
            <Route path="/settings" element={<Settings />} /> {/* Settings route */}
          </Routes>
        </main>

        {/* Right Sidebar (Collapsible) */}
        {!isSettingsPage && isRightSidebarOpen && (
          <aside className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}>
            <h2>Generated Links of Websites and Documents</h2>
          </aside>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
