// ProfileDropdown.jsx
import React, { useState } from 'react';
import './ProfileDropdown.css'; // Separate CSS for the dropdown

const ProfileDropdown = () => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false); // State for profile dropdown

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen); // Toggle profile dropdown
  };

  return (
    <div className="profile-section">
      {/* Profile Button */}
      <button className="profile-button" onClick={toggleProfileDropdown}>
        A
      </button>

      {/* Dropdown Menu */}
      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>User</li>
            <li>Role</li>
            <li>Settings</li>
            <li>Log out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
