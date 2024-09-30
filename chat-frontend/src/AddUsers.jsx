import React, { useState } from 'react';
import axios from 'axios';
import './AddUsers.css'; // Assuming you have CSS for styling

const AddUsers = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Basic validation before making a request
    if (!email || !username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Prepare user data to send to backend
    const newUser = { email, username, role, password };

    try {
      // Make API call to your backend to create a new user
      const response = await axios.post('http://localhost:5000/api/auth/signup', newUser);

      // If user added successfully, clear the form and show success message
      setSuccess(`User ${response.data.user.username} added successfully`);
      setEmail('');
      setUsername('');
      setRole('user');
      setPassword('');
      setError(''); // Clear any error messages
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
      setSuccess(''); // Clear any success messages
    }
  };

  return (
    <div className="add-users-container">
      <h2>Add New User</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleAddUser}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user's email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter user's username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="intern">Intern</option>
            <option value="SDE">SDE</option>
            <option value="HR">HR</option>
            <option value="Sales manager">Sales Manager</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter user's password"
            required
          />
        </div>

        <button type="submit" className="submit-button">Add User</button>
      </form>
    </div>
  );
};

export default AddUsers;
