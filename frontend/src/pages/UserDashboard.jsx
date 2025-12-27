import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [formData, setFormData] = useState({ subject: '', equipment: '', request_type: 'corrective' });
  const navigate = useNavigate();

  // Load available equipment on mount
  useEffect(() => {
    // In a real app, we would verify the token here
    axios.get('http://localhost:8000/api/equipment/')
      .then(res => setEquipmentList(res.data))
      .catch(err => console.error("Error loading equipment", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/requests/', formData);
      alert('Request Submitted Successfully!');
      setFormData({ subject: '', equipment: '', request_type: 'corrective' }); // Reset form
    } catch (error) {
      alert('Error submitting request.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container" style={{textAlign: 'left'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} style={{width:'auto', background:'#e74c3c'}}>Logout</button>
      </div>

      <div className="login-wrapper" style={{margin: '20px 0', maxWidth: '600px'}}>
        <h3>Report a Breakdown</h3>
        <form onSubmit={handleSubmit}>
          <label>What is the problem?</label>
          <input type="text" placeholder="e.g. Printer is smoking" required 
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})} 
          />

          <label>Select Equipment:</label>
          <select required value={formData.equipment} 
            onChange={e => setFormData({...formData, equipment: e.target.value})}>
            <option value="">-- Choose Machine --</option>
            {equipmentList.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name} ({eq.serial_no})</option>
            ))}
          </select>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;