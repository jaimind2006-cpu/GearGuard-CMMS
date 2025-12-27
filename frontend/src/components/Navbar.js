import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"><h2>GearGuard</h2></div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/login">User Login</Link>
        <Link to="/staff-login">Staff Access</Link>
        <Link to="/signup" style={{background: '#3498db', padding: '5px 10px', borderRadius: '4px'}}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;