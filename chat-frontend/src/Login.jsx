import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';




const Login = ({ setIsLoggedIn, setUserInfo, handleLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Effect to add background only on login page
  useEffect(() => {
    document.body.classList.add('login-background');

    return () => {
      document.body.classList.remove('login-background');
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('FormData:', formData); 
    if (!formData.email || !formData.password) {
      setErrorMessage('Email and Password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('json form:', JSON.stringify(formData));


      const data = await response.json();
      console.log('Full Response:', response); // Log entire response for status and headers
      console.log('Response:', data); // Log for debugging

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserInfo({ username: data.user.username, role: data.user.role });
        setIsLoggedIn(true);
        setSuccessMessage('Login successful! Redirecting...');
        handleLoginSuccess();

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <video
        className="video-background"
        autoPlay
        loop
        muted
        src={`${process.env.PUBLIC_URL}/images/grid4.mp4`} // Use template literal with curly braces
        type="video/mp4"
      />
   

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="login-form">
      <h2>Login to YUGM</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="signup-link">
        New User? <Link to="/signup">Create Account</Link>
      </p>
      </form>
     
    </div>
  );
};

export default Login;