// src/ProfileDropdown.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ProfileDropdown.css'; // Separate CSS for the dropdown

const ProfileDropdown = () => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const goToSettings = () => {
    navigate('/settings'); // Navigate to the Settings page
    setProfileDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="profile-section">
      <button className="profile-button" onClick={toggleProfileDropdown}>
        A
      </button>

      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>User</li>
            <li>Role</li>
            <li onClick={goToSettings}>Settings</li> {/* Clickable link to Settings */}
            <li>Log out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
