import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    axios.get('http://localhost:8000/api/requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  // Function to move card to next stage (Simple workflow logic)
  const advanceStage = async (req) => {
    let nextStage = '';
    if (req.stage === 'new') nextStage = 'in_progress';
    else if (req.stage === 'in_progress') nextStage = 'repaired';
    
    if (nextStage) {
      await axios.patch(`http://localhost:8000/api/requests/${req.id}/`, { stage: nextStage });
      refreshData();
    }
  };

  const KanbanColumn = ({ title, stage, color }) => (
    <div style={{flex: 1, background: '#ecf0f1', margin: '10px', padding: '10px', borderRadius: '8px', minHeight: '400px'}}>
      <h3 style={{borderBottom: `4px solid ${color}`, paddingBottom: '10px'}}>{title}</h3>
      {requests.filter(r => r.stage === stage).map(r => (
        <div key={r.id} style={{background: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <strong>{r.subject}</strong>
          <p style={{fontSize: '0.9em', color: '#7f8c8d'}}>{r.equipment_name || 'Unknown Equipment'}</p>
          {/* Overdue Logic [cite: 60] */}
          {r.scheduled_date && new Date(r.scheduled_date) < new Date() && (
             <div style={{color: 'red', fontWeight: 'bold', fontSize: '0.8em'}}>OVERDUE</div>
          )}
          {stage !== 'repaired' && (
             <button onClick={() => advanceStage(r)} style={{marginTop: '10px', fontSize: '0.8em', padding: '5px'}}>
               Move Next &rarr;
             </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{padding: '20px'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h2>Technician Workspace</h2>
        <button onClick={() => navigate('/staff-login')} style={{width:'auto', background:'#e74c3c'}}>Logout</button>
      </div>
      
      {/* Kanban Container */}
      <div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto'}}>
        <KanbanColumn title="New Requests" stage="new" color="#3498db" />
        <KanbanColumn title="In Progress" stage="in_progress" color="#f1c40f" />
        <KanbanColumn title="Repaired" stage="repaired" color="#27ae60" />
      </div>
    </div>
  );
};

export default TechnicianDashboard;