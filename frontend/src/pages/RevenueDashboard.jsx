import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the data we just created in Django
    axios.get('http://localhost:8000/api/revenue-data/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>💰 Financial Performance</h1>
        <button onClick={() => navigate('/manager-dashboard')} style={{background:'#7f8c8d', width:'auto'}}>Back to Dashboard</button>
      </div>

      {/* Summary Cards */}
      <div style={{display:'flex', gap:'20px', marginBottom:'40px'}}>
        <div className="kpi-card" style={{background:'#27ae60'}}>
            <h3>Total Revenue</h3>
            <div className="big-number">$52,400</div>
            <p>+12% from last month</p>
        </div>
        <div className="kpi-card" style={{background:'#8e44ad'}}>
            <h3>Net Profit</h3>
            <div className="big-number">$32,150</div>
            <p>Healthy margins</p>
        </div>
      </div>

      {/* THE CHART SECTION */}
      <div style={{background:'white', padding:'30px', borderRadius:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginBottom:'20px', color:'#2c3e50'}}>Revenue Growth (6 Months)</h3>
        
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Line 1: Revenue (Blue) */}
              <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={3} activeDot={{ r: 8 }} />
              {/* Line 2: Profit (Green) */}
              <Line type="monotone" dataKey="profit" stroke="#2ecc71" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default RevenueDashboard;