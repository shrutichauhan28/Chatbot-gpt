import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddUsers.css'; // Assuming you have CSS for styling

const AddUsers = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userQueue, setUserQueue] = useState([]); // State to hold the list of added users
  const [allUsers, setAllUsers] = useState([]); // State to hold all users fetched from the database

  // Fetch all users from the backend when the component mounts
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');  // or however you store the token
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`  // Pass the token in the Authorization header
        }
      });
      console.log('Users:', response.data);
      setAllUsers(response.data.users); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  


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

      // If user added successfully, update the user queue and clear the form
      setUserQueue([...userQueue, { username: response.data.user.username, email, role }]);
      setSuccess(`User ${response.data.user.username} added successfully`);
      setEmail('');
      setUsername('');
      setRole('user');
      setPassword('');
      setError(''); // Clear any error messages

      // Refetch users to update the list after a new user is added
      const allUsersResponse = await axios.get('http://localhost:5000/api/auth/users');
      setAllUsers(allUsersResponse.data.users);
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
          <label htmlFor="role" className="role">Role</label><br />
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
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
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">Add User</button>
      </form>

      <div className="user-queue">
        <h3>Users in Queue:</h3>
        <ul>
          {userQueue.map((user, index) => (
            <li key={index} className="user-list">{user.username} - {user.email} ({user.role})</li>
          ))}
        </ul>
      </div>

      <h3>All Users:</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th className='user-list'>Name</th>
            <th className='user-list'>Email</th>
            <th className='user-list'>Role</th>
            <th className='user-list'>Created On</th>
            <th className='user-list'>Last Accessed On</th>
            <th className='user-list'>Status</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr key={index} className='user-list'>
              <td className='user-list'>{user.username}</td>
              <td className='user-list'>{user.email}</td>
              <td className='user-list'>{user.role}</td>
              <td className='user-list'>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className='user-list'>{user.lastAccessed ? `${user.lastAccessed} ago` : 'Never'}</td>
              <td className='user-list'><button className="status-button">Claimed</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddUsers;
