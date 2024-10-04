import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './AddUsers.css'; // Ensure you have appropriate styling

const AddUsers = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userQueue, setUserQueue] = useState([]); // State to hold the list of added users
  const [allUsers, setAllUsers] = useState([]); // State to hold all users fetched from the database
  const [selectedFiles, setSelectedFiles] = useState([]); // State for selected files
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop
  const fileInputRef = useRef(null); // Ref for file input

  // Fetch all users from the backend when the component mounts
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      console.log('Users:', response.data);
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle individual user addition via form
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
      const token = localStorage.getItem('token'); // Get JWT token
      const response = await axios.post('http://localhost:5000/api/auth/signup', newUser, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      // If user added successfully, update the user queue and clear the form
      setUserQueue([...userQueue, { username: response.data.user.username, email, role }]);
      setSuccess(`User ${response.data.user.username} added successfully`);
      setEmail('');
      setUsername('');
      setRole('user');
      setPassword('');
      setError(''); // Clear any error messages

      // Refetch users to update the list after a new user is added
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
      setSuccess(''); // Clear any success messages
    }
  };

  // Handle drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files).filter(file => file.name);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).filter(file => file.name);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle file upload
  // const handleFileUpload = async () => {
  //   if (selectedFiles.length === 0) {
  //     toast.error('Please select at least one file before uploading.');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     selectedFiles.forEach((file) => {
  //       if (file && file.name) {
  //         formData.append('files', file); // Ensure file is valid
  //       } else {
  //         toast.error('Invalid file selected');
  //       }
  //     });

  //     const token = localStorage.getItem('token');
  //     await axios.post('http://localhost:5000/api/auth/upload-users', formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     toast.success('Users uploaded successfully');
  //     console.log(formData.getAll('files')); // To verify file contents
  //     setSelectedFiles([]); // Clear selected files after successful upload
  //     fetchUsers();
  //   } catch (error) {
  //     console.error('Error uploading users: ', error);
  //     toast.error('Failed to upload users. Please try again.');
  //   }
  // };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file before uploading.');
      return;
    }
  
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file); // Ensure that 'files' is used in both front and back
      });
  
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/upload-users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success('Users uploaded successfully');
      console.log(formData.getAll('files'));  // To verify file contents
      setSelectedFiles([]); // Clear selected files after successful upload
      fetchUsers();
    } catch (error) {
      console.error('Error uploading users: ', error);
      toast.error('Failed to upload users. Please try again.');
    }
  };
  

  return (
    <div className="add-users-container">
      <ToastContainer />
      <h2>Add New User</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Individual User Form */}
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
          />
        </div>

        <button type="submit" className="submit-button">Add User</button>
      </form>

      <div className="user-queue">
        <h3>Users in Queue:</h3>
        <ul>
          {userQueue.map((user, index) => (
            <li key={index}>{user.username} - {user.email} ({user.role})</li>
          ))}
        </ul>
      </div>

      {/* Drag and Drop Section */}
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}
      >
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => <p key={index}>{file.name}</p>)
        ) : (
          <p>Drag and drop files here or click to select</p>
        )}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the default file input
        />
      </div>

      <button onClick={handleFileUpload} className="upload-button">Upload Users</button>

      <h3>All Users:</h3>
      <table className="users-table">
        <thead>
          <tr >
            <th className='tc-tr'>Name</th>
            <th className='tc-tr'>Email</th>
            <th className='tc-tr'>Role</th>
            <th className='tc-tr'>Created On</th>
           
          </tr>
        </thead>
        <tbody className='table-content'>
          {allUsers.map((user, index) => (
            <tr key={index} >
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddUsers;
