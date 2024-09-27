import React, { useState } from 'react';
import './ProfileDropdown.css'; // Separate CSS for the dropdown
import { useNavigate } from 'react-router-dom'; // Import useNavigate for logout

const ProfileDropdown = ({ userInfo, handleLogout }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false); // State for profile dropdown
  const navigate = useNavigate(); // Initialize navigate

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen); // Toggle profile dropdown
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the passed logout function
    setProfileDropdownOpen(false); // Close dropdown after logout
    navigate('/login'); // Navigate to login page after logout
  };

  // Ensure userInfo has default values
  const username = userInfo?.username || 'Guest'; // Fallback to 'Guest' if undefined
  const role = userInfo?.role || 'Role not assigned'; // Fallback for role

  // Get the first letter of the username
  const displayInitial = username.charAt(0).toUpperCase(); // Use the username for initial display

  return (
    <div className="profile-section">
      {/* Profile Button */}
      <button className="profile-button" onClick={toggleProfileDropdown}>
        {displayInitial} {/* Display initial of user's name */}
      </button>

      {/* Dropdown Menu */}
      {isProfileDropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>{username}</li> {/* Display user name dynamically */}
            <li>{role}</li> {/* Display user role dynamically */}
            <li>Settings</li>
            <li onClick={handleLogoutClick}>Log out</li> {/* Handle logout */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
