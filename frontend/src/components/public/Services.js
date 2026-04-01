import React from 'react';
import { FaHome, FaHospital, FaBookMedical, FaAmbulance } from 'react-icons/fa';

const iconMap = {
  home: FaHome,
  hospital: FaHospital,
  education: FaBookMedical,
  emergency: FaAmbulance,
};

const Services = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="services" className="services-section">
      <div className="section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="section-header">
          <h2>Mes <span className="highlight">Services</span></h2>
          <p>Des soins professionnels adaptes a vos besoins</p>
          <div className="section-line"></div>
        </div>
        <div className="services-grid">
          {data.map((service) => {
            const IconComponent = iconMap[service.icon] || FaHospital;
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <IconComponent />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
