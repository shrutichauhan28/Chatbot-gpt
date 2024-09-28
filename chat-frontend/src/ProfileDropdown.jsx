import React, { useState } from 'react';
import './ProfileDropdown.css';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ userInfo, handleLogout }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const displayInitial = userInfo?.username.charAt(0).toUpperCase();

  return (
    <div className="profile-section">
      <button className="profile-button" onClick={toggleProfileDropdown}>
        {displayInitial || 'G'}
      </button>

      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>{userInfo?.username || 'Guest'}</li>
            <li>{userInfo?.role || 'Role not assigned'}</li>
            <li onClick={() => navigate('/settings')}>Settings</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
