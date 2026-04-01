import React from 'react';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="experience-section">
      <div className="section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="section-header">
          <h2>Mon <span className="highlight">Experience</span></h2>
          <p>Mon parcours professionnel dans le domaine de la sante</p>
          <div className="section-line"></div>
        </div>
        <div className="timeline">
          {data.map((exp) => (
            <div key={exp.id} className={`timeline-item ${exp.current ? 'current' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">
                  {exp.startDate} - {exp.endDate}
                </span>
                <h3>{exp.title}</h3>
                <h4>{exp.company} {exp.location ? `- ${exp.location}` : ''}</h4>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
