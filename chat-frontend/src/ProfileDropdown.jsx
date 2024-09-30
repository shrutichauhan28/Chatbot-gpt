import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ userInfo, handleLogout }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to the Settings page
    setProfileDropdownOpen(false); // Close dropdown after navigation
  };

  const handleUsersClick=()=>{
    navigate('/addusers');
    setProfileDropdownOpen(false);
  }
  return (
    <div className="profile-section">
      <button className="profile-button" onClick={toggleProfileDropdown}>
        {userInfo.username.charAt(0).toUpperCase()}
      </button>

      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>{userInfo.username}</li>
            <li>{userInfo.role}</li>
            {userInfo.role === 'admin' && (
              <li onClick={handleSettingsClick}>Settings</li> // Settings option
            )}
            {userInfo.role === 'admin' && (
              <li onClick={handleUsersClick}>Manage Users</li>
            )}

            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
