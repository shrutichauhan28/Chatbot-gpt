import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ userInfo, handleLogout }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Create a reference for the dropdown

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    // Close dropdown if clicked outside
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setProfileDropdownOpen(false);
    }
  };

  // Use effect to listen for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to the Settings page
    setProfileDropdownOpen(false); // Close dropdown after navigation
  };

  const handleUsersClick = () => {
    navigate('/addusers');
    setProfileDropdownOpen(false);
  };

  return (
    <div className="profile-section" ref={dropdownRef}>
      <button className="profile-button" onClick={toggleProfileDropdown}>
        {userInfo.username.charAt(0).toUpperCase()}
      </button>

      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <p className="username">{userInfo.username}</p>
            <p className="role">{userInfo.role} @ ValueBound</p>
          </div>
          <ul>
            {userInfo.role === 'admin' && (
              <>
                <li onClick={handleSettingsClick}>Manage Knowledge Base</li>
                <li onClick={handleUsersClick}>Manage Users</li>
              </>
            )}
            <li onClick={handleLogout}>Logout</li> {/* Add Logout option */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
