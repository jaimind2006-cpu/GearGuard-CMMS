import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login/', { ...creds, role: 'user' });
      alert(`Welcome back, ${res.data.user.username}!`);
      // Save token/user info to localStorage here
      localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/user-dashboard');
    } catch (error) {
      alert('Login Failed. Check credentials.');
    }
  };

  return (
    <div className="login-wrapper">
      <h2>User Portal Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required 
           onChange={e => setCreds({...creds, username: e.target.value})} />
        <input type="password" placeholder="Password" required 
           onChange={e => setCreds({...creds, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLogin;