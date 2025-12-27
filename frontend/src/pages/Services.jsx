import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Corrective Maintenance",
      type: "Breakdown Repair",
      desc: "Immediate repair for unexpected failures.",
      cost: "$50 / hour"
    },
    {
      title: "Preventive Maintenance",
      type: "Routine Checkup",
      desc: "Scheduled inspections to prevent failures.",
      cost: "$120 Flat Rate"
    },
    {
      title: "Asset Auditing",
      type: "Inventory",
      desc: "Complete tracking of serial numbers and warranty.",
      cost: "$200 Setup"
    }
  ];

  return (
    <div className="container">
      <h1>Our Services</h1>
      <div className="service-list">
        {services.map((s, i) => (
          <div key={i} className="service-card">
            <h3>{s.title}</h3>
            <span className="badge">{s.type}</span>
            <p>{s.desc}</p>
            <p style={{fontWeight: 'bold', color: '#27ae60'}}>{s.cost}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;