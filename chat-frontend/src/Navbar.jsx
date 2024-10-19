import React from 'react';
import { Link } from 'react-router-dom';
import { MdLogout } from 'react-icons/md'; 
import { BiMessageAlt, BiBookmark } from "react-icons/bi"; 
import { BsClockHistory } from "react-icons/bs";
import ProfileDropdown from './ProfileDropdown'; 
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import './Navbar.css';

function Navbar({ isChatPath, isLeftSidebarOpen, toggleLeftSidebar, isLoggedIn, userInfo, handleLogout }) {
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
        {/* Conditional rendering for title */}
        {isLeftSidebarOpen && <h1 className="navbar-title">YUGM</h1>}
      </div>

      <div className="navbar-right">
        {/* Conditionally render icons when sidebar is collapsed */}
        {!isLeftSidebarOpen && (
          <>
            <BiMessageAlt size={20} className="navbar-icon" />
            <BsClockHistory size={20} className="navbar-icon" />
            <BiBookmark size={20} className="navbar-icon" />
          </>
        )}

        {/* Conditionally render profile and logout button */}
        {isLoggedIn && (
          <>
            <ProfileDropdown 
              userInfo={userInfo} 
              handleLogout={handleLogout} 
              className={`profile-icon ${isLeftSidebarOpen ? "" : "collapsed-profile-icon"}`} 
            />
            {isLeftSidebarOpen && (
              <MdLogout 
                className="logout-icon" 
                size={24} 
                onClick={handleLogout} 
                title="Logout"
              />
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
