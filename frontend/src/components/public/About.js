import React from 'react';
import { FaUserNurse } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const About = ({ data }) => {
  if (!data) return null;

  return (
    <section id="about" className="section">
      <div className="section-header">
        <h2>A <span className="highlight">Propos</span></h2>
        <p>Decouvrez mon parcours et ma passion pour les soins infirmiers</p>
        <div className="section-line"></div>
      </div>
      <div className="about-grid">
        <div className="about-image">
          <div className="about-image-box">
            {data.image ? (
              <img src={`${API_BASE}${data.image}`} alt="Amy Diallo" />
            ) : (
              <div className="placeholder">
                <FaUserNurse />
              </div>
            )}
          </div>
        </div>
        <div className="about-content">
          <h3>Infirmiere passionnee & devouee</h3>
          <p>{data.description}</p>
          {data.stats && (
            <div className="about-stats">
              {data.stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="value">{stat.value}</div>
                  <div className="label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
