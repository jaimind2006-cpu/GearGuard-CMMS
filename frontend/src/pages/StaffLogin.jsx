import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [role, setRole] = useState('technician');
  const [creds, setCreds] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate role with backend
      const res = await axios.post('http://localhost:8000/api/login/', { ...creds, role: role });
      alert(`Staff Access Granted: ${res.data.user.username} (${role})`);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect based on role
      if (role === 'technician') {
        navigate('/tech-dashboard');
      } else {
        navigate('/manager-dashboard');
      }

    } catch (error) {
      alert(error.response?.data?.error || 'Login Failed');
    }
  };

  return (
    <div className="login-wrapper" style={{borderTop: '5px solid #e74c3c'}}>
      <h2>Staff Access</h2>
      <p>Authorized Personnel Only</p>
      <form onSubmit={handleSubmit}>
        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="technician">Technician</option>
          <option value="manager">Manager</option>
        </select>

        <input type="text" placeholder="Staff ID" required 
           onChange={e => setCreds({...creds, username: e.target.value})} />
        <input type="password" placeholder="Password" required 
           onChange={e => setCreds({...creds, password: e.target.value})} />
        
        <button type="submit" style={{background: '#c0392b'}}>Login as {role.toUpperCase()}</button>
      </form>
    </div>
  );
};

export default StaffLogin;