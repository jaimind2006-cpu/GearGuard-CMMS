import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ critical_equipment: 0, tech_utilization: 0, pending_requests: 0, overdue_requests: 0 });
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:8000/api/manager-stats/');
      const reqRes = await axios.get('http://localhost:8000/api/requests/');
      
      setStats(statsRes.data);
      setRequests(reqRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      
      {/* Top Header & Search (Wireframe Style) */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1>Manager Dashboard</h1>
        <div style={{display: 'flex', gap: '10px'}}>
           <input type="text" placeholder="Search..." style={{padding: '8px', width: '300px'}} />
           {/* NEW BUTTON */}
    <button onClick={() => navigate('/add-equipment')} style={{background:'#3498db', width:'auto'}}>
        + Add Equipment
    </button>
    <button onClick={() => navigate('/revenue')} style={{background:'#8e44ad', width:'auto', marginLeft:'10px'}}>
   View Revenue 📈
</button>
           <button onClick={() => navigate('/staff-login')} style={{background:'#7f8c8d', width: 'auto'}}>Logout</button>
        </div>
      </div>

      {/* KPI CARDS (The Red, Blue, Green Cards) */}
      <div className="kpi-container">
        
        {/* Red Card: Critical Equipment */}
        <div className="kpi-card red-card">
          <h3>Critical Equipment</h3>
          <div className="big-number">{stats.critical_equipment} Units</div>
          <p>(Health &lt; 30%)</p>
        </div>

        {/* Blue Card: Technician Load */}
        <div className="kpi-card blue-card">
          <h3>Technician Load</h3>
          <div className="big-number">{stats.tech_utilization}% Utilized</div>
          <p>(Assign Carefully)</p>
        </div>

        {/* Green Card: Open Requests */}
        <div className="kpi-card green-card">
          <h3>Open Requests</h3>
          <div className="big-number">{stats.pending_requests} Pending</div>
          <p>{stats.overdue_requests} Overdue</p>
        </div>
      </div>

      {/* Request Table */}
      <div className="table-container">
        <h3>Current Maintenance Activity</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Technician</th>
              <th>Type</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}
                onClick={() => navigate(`/requests/${req.id}`)}  
                style={{cursor: 'pointer', transition: 'background 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td>{req.subject}</td>
                <td>{req.equipment_name}</td>
                <td>
                    {req.assigned_technician ? 
                        <span className="tech-badge">{req.assigned_technician}</span> : 
                        <span style={{color:'red'}}>Unassigned</span>
                    }
                </td>
                <td>{req.request_type}</td>
                <td>
                  <span className={`status-badge ${req.stage}`}>
                    {req.stage.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;