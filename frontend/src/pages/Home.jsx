import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1>GearGuard</h1>
        <h2>The Ultimate Maintenance Tracker</h2>
        <p>Seamlessly connecting Equipment, Teams, and Requests.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">Get Started</Link>
          <Link to="/services" className="btn-secondary">View Services</Link>
        </div>
      </div>
      
      <div style={{marginTop: '50px'}}>
        <h3>Why Choose GearGuard?</h3>
        <p>Ensure your assets are always running. Track ownership, schedule repairs, and manage teams effortlessly.</p>
      </div>
    </div>
  );
};

export default Home;