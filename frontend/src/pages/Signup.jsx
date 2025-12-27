import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    try {
      // Default role is 'user'
      await axios.post('http://localhost:8000/api/register/', { ...formData, role: 'user' });
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      // Check if the server sent a specific error message
      if (error.response && error.response.data) {
        // Django specifically sends { username: ["A user with that username already exists."] }
        if (error.response.data.username) {
          setErrorMessage(`Username Error: ${error.response.data.username[0]}`);
        } else {
          setErrorMessage('Registration failed. Please check your details.');
        }
      } else {
        setErrorMessage('Server error. Is the backend running?');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Create Account</h2>
      
      {/* Display Error Message in Red if it exists */}
      {errorMessage && (
        <div style={{color: 'red', marginBottom: '10px', background: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username / Unique ID" required 
           value={formData.username}
           onChange={e => setFormData({...formData, username: e.target.value})} />
        
        <input type="email" placeholder="Email" required 
           value={formData.email}
           onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Password" required 
           value={formData.password}
           onChange={e => setFormData({...formData, password: e.target.value})} />
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;