import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdLogout } from 'react-icons/md'; 
import ProfileDropdown from './ProfileDropdown'; 
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import './Navbar.css';

function Navbar({ isChatPath, isLeftSidebarOpen, toggleLeftSidebar, isLoggedIn, userInfo, handleLogout, isRightSidebarOpen, toggleRightSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo */}
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
        </Link>
        {/* Left Arrow Icon for Left Sidebar */}
        {isChatPath && (
          <TbLayoutSidebarLeftCollapseFilled
            className="toggle-left-sidebar-icon"
            size={24}
            onClick={toggleLeftSidebar}
            title={isLeftSidebarOpen ? "Hide Left Sidebar" : "Show Left Sidebar"}
          />
        )}
      </div>

      <div className="navbar-center">
        <h1 className="navbar-title">YUGM</h1>
      </div>

      <div className="navbar-right">
        {isLoggedIn && (
          <>
            <ProfileDropdown userInfo={userInfo} handleLogout={handleLogout} />
            <MdLogout 
              className="logout-icon" 
              size={24} 
              onClick={handleLogout} 
              title="Logout"
            />
          </>
        )}
        {/* Right Arrow Icon for Right Sidebar */}
      </div>
    </nav>
  );
}

export default Navbar;
