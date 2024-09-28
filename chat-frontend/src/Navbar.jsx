import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdLogout } from 'react-icons/md'; // Add MdLogout
import ProfileDropdown from './ProfileDropdown'; // Assuming this exists
import './Navbar.css';

function Navbar({ isChatPath, isLeftSidebarOpen, toggleLeftSidebar, isLoggedIn, userInfo, handleLogout, isRightSidebarOpen, toggleRightSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Left Arrow Icon for Left Sidebar - Moved before the Title */}
        {isChatPath && (
          <MdOutlineArrowLeft
            className="toggle-left-sidebar-icon"
            size={24}
            onClick={toggleLeftSidebar}
            title={isLeftSidebarOpen ? "Hide Left Sidebar" : "Show Left Sidebar"}
          />
        )}
        <div className="title">
          <h1>YUGM</h1>
        </div>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <ProfileDropdown userInfo={userInfo} handleLogout={handleLogout} />
            <MdLogout 
              className="logout-icon" 
              size={24} 
              onClick={handleLogout} 
              title="Logout"
            />
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn btn-gradient-border btn-glow">Signup</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-gradient-border btn-glow">Login</button>
            </Link>
          </>
        )}
        {/* Right Arrow Icon for Right Sidebar */}
        {isChatPath && (
          <MdOutlineArrowRight
            className="toggle-right-sidebar-icon"
            size={24}
            onClick={toggleRightSidebar}
            title={isRightSidebarOpen ? "Hide Right Sidebar" : "Show Right Sidebar"}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
