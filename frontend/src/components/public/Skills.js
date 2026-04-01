import React, { useState, useEffect, useRef } from 'react';

const Skills = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="section-header">
        <h2>Mes <span className="highlight">Competences</span></h2>
        <p>Des competences solides au service de la sante</p>
        <div className="section-line"></div>
      </div>
      <div className="skills-grid">
        {data.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-header">
              <h4>{skill.name}</h4>
              <span>{skill.level}%</span>
            </div>
            <div className="skill-bar">
              <div
                className="skill-bar-fill"
                style={{ width: visible ? `${skill.level}%` : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
