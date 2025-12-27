import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [workCenterList, setWorkCenterList] = useState([]); // New List
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [reqRes, equipRes, wcRes] = await Promise.all([
            axios.get(`http://localhost:8000/api/requests/${id}/`),
            axios.get('http://localhost:8000/api/equipment/'),
            axios.get('http://localhost:8000/api/work-centers/')
        ]);

        setRequest(reqRes.data);
        setEquipmentList(equipRes.data);
        setWorkCenterList(wcRes.data);
        
      } catch (err) {
        console.error("Error loading data:", err);
        // Alert the user so they know what happened
        alert("Error loading data! Check console (F12) for details. Is Backend running?");
      } finally {
        // Stop loading whether it worked OR failed
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Logic to clear the unselected field
    const payload = { ...request };
    if (payload.maintenance_for === 'equipment') {
        payload.work_center = null;
    } else {
        payload.equipment = null;
    }

    try {
      await axios.put(`http://localhost:8000/api/requests/${id}/`, payload);
      alert('Saved!');
      navigate(-1);
    } catch (err) {
      alert('Error saving');
    }
  };

  if (loading) return <div>Loading...</div>;
  // --- ADD THIS SAFETY CHECK ---
  if (!request) {
    return (
      <div className="container" style={{padding: '50px', textAlign: 'center'}}>
        <h2 style={{color: '#e74c3c'}}>⚠️ Error Loading Request</h2>
        <p>The system could not retrieve the data.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
  // -----------------------------

  return (
    <div className="container" style={{maxWidth: '1000px', textAlign: 'left'}}>
      {/* ... Header and Status Bar code remains the same ... */}
      
      <div className="detail-form-card">
        <div className="form-row">
          <div className="form-col">
            <label>Subject</label>
            <input type="text" name="subject" value={request.subject} onChange={handleChange} />

            {/* --- NEW SWITCHING LOGIC --- */}
            <label style={{marginTop:'20px', color:'#e67e22'}}>Maintenance For:</label>
            <select name="maintenance_for" value={request.maintenance_for} onChange={handleChange} 
                style={{border:'2px solid #e67e22', background:'#fffbf0'}}>
                <option value="equipment">Single Equipment</option>
                <option value="work_center">Work Center (Zone)</option>
            </select>

            {/* CONDITIONAL DROPDOWN */}
            {request.maintenance_for === 'equipment' ? (
                <>
                    <label>Select Equipment</label>
                    <select name="equipment" value={request.equipment || ''} onChange={handleChange}>
                        <option value="">-- Choose Machine --</option>
                        {equipmentList.map(eq => (
                            <option key={eq.id} value={eq.id}>{eq.name}</option>
                        ))}
                    </select>
                </>
            ) : (
                <>
                    <label>Select Work Center</label>
                    <select name="work_center" value={request.work_center || ''} onChange={handleChange}>
                        <option value="">-- Choose Work Center --</option>
                        {workCenterList.map(wc => (
                            <option key={wc.id} value={wc.id}>{wc.name} (Code: {wc.code})</option>
                        ))}
                    </select>
                </>
            )}
            {/* --------------------------- */}

          </div>
          {/* ... Right Column remains the same ... */}
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;