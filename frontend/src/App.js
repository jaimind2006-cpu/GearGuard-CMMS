import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import UserLogin from './pages/UserLogin';
import StaffLogin from './pages/StaffLogin';
import Signup from './pages/Signup';
import RequestDetail from './pages/RequestDetail';
import UserDashboard from './pages/UserDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EquipmentForm from './pages/EquipmentForm'; // <--- Import this
import RevenueDashboard from './pages/RevenueDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/tech-dashboard" element={<TechnicianDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} /> {/* <--- AND THIS */}
        <Route path="/add-equipment" element={<EquipmentForm />} /> {/* <--- Add this */}
        <Route path="/revenue" element={<RevenueDashboard />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
      </Routes>
    </Router>
  );
}

export default App