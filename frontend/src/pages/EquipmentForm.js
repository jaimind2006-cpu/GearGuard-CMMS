import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EquipmentForm = () => {
  const navigate = useNavigate();
  
  // Form State matching your Django Model
  const [formData, setFormData] = useState({
    name: '',
    serial_no: '',
    location: '',
    department: 'production', // Default
    maintenance_team: '',
    default_technician: '',
    purchase_date: '',
    warranty_info: ''
  });

  // Dropdown Data
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 1. Fetch Teams for the dropdown
    // Note: If you haven't created a dedicated API for teams, we might need to mock it 
    // or use the existing /users/ endpoint if you want to select people. 
    // For this step, I'll assume standard text input for Team if API is missing, 
    // but ideally we fetch from http://localhost:8000/api/teams/ (if you created it).
    // To keep it simple and working: We will use text inputs for now unless you added a Team ViewSet.
    
    // 2. Fetch Users (Technicians)
    // We need a list of users to populate the "Technician" dropdown
    // Accessing /api/users/ requires a ViewSet. 
    // If this fails, the dropdown will just show IDs or be empty.
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create a clean copy of the data
    const payload = { ...formData };

    // 2. Fix Empty Foreign Keys (The cause of your 400 Error)
    // If the user typed nothing, send 'null' instead of empty text ""
    if (!payload.maintenance_team) payload.maintenance_team = null;
    if (!payload.default_technician) payload.default_technician = null;

    // 3. Fix Empty Date
    if (!payload.purchase_date) payload.purchase_date = null;

    try {
      // Send the CLEAN payload, not the original formData
      await axios.post('http://localhost:8000/api/equipment/', payload);
      alert('Equipment Created Successfully!');
      navigate('/manager-dashboard');
    } catch (error) {
      console.error("Server Error:", error.response?.data); // Check console for details
      alert('Error: ' + JSON.stringify(error.response?.data || "Check inputs"));
    }
  };
  
  return (
    <div className="container" style={{maxWidth: '900px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
         <h1>New Equipment</h1>
         <button onClick={() => navigate(-1)} style={{background:'#95a5a6', width:'auto'}}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="detail-form-card" style={{textAlign:'left'}}>
        {/* Top Section: Identity */}
        <div className="form-row">
            <div className="form-col">
                <label>Equipment Name</label>
                <input type="text" name="name" placeholder="e.g. Samsung Monitor 15" required onChange={handleChange} />
                
                <label>Serial Number</label>
                <input type="text" name="serial_no" placeholder="e.g. SM-2025-X" onChange={handleChange} />

                <label>Department / Category</label>
                <select name="department" onChange={handleChange}>
                    <option value="production">Production</option>
                    <option value="it">IT Department</option>
                </select>
            </div>
            
            <div className="form-col">
                <label>Physical Location</label>
                <input type="text" name="location" placeholder="e.g. Office 2, Desk 4" required onChange={handleChange} />
                
                <label>Purchase / Assigned Date</label>
                <input type="date" name="purchase_date" onChange={handleChange} />
            </div>
        </div>

        <hr style={{margin: '30px 0', border: '0', borderTop: '1px solid #eee'}} />

        {/* Bottom Section: Responsibility (The "Teaming Bee" part) */}
        <h3>Responsibility & Maintenance</h3>
        <div className="form-row">
            <div className="form-col">
                <label>Maintenance Team (ID)</label>
                {/* Using simple input for now. Enter the ID number (e.g., 1 or 2) */}
                <input type="number" name="maintenance_team" placeholder="Enter Team ID (e.g. 1)" onChange={handleChange} />
                <small style={{color:'#7f8c8d'}}>Enter 1 for Mechanics, 2 for IT (Check Admin for IDs)</small>
            </div>
            
            <div className="form-col">
                 <label>Default Technician (ID)</label>
                 <input type="number" name="default_technician" placeholder="Enter User ID" onChange={handleChange} />
                 <small style={{color:'#7f8c8d'}}>Enter the User ID of the technician</small>
            </div>
        </div>

        <div style={{marginTop: '30px', textAlign:'right'}}>
            <button type="submit" style={{width:'200px', background:'#27ae60'}}>Create Equipment</button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;