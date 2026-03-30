import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const Education = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="education" className="section">
      <div className="section-header">
        <h2>Ma <span className="highlight">Formation</span></h2>
        <p>Mon parcours academique et mes diplomes</p>
        <div className="section-line"></div>
      </div>
      <div className="education-grid">
        {data.map((edu) => (
          <div key={edu.id} className="education-card">
            <div className="education-icon">
              <FaGraduationCap />
            </div>
            <h3>{edu.degree}</h3>
            <h4>{edu.school}</h4>
            <div className="year">{edu.year}</div>
            <p>{edu.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
