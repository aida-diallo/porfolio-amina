import React from 'react';
import { FiArrowDown, FiHeart, FiDownload } from 'react-icons/fi';
import { FaUserNurse, FaHeartbeat, FaStethoscope } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Hero = ({ data, cv }) => {
  if (!data) return null;

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <FaStethoscope /> Professionnelle de Sante
          </div>
          <h1>
            Bonjour, je suis<br />
            <span className="highlight">{data.name || 'Amy Diallo'}</span>
          </h1>
          <h2>{data.title || 'Infirmiere Diplomee d\'Etat'}</h2>
          <p>{data.subtitle || 'Passionnee par le soin et le bien-etre des patients'}</p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">
              <FiHeart /> Me Contacter
            </a>
            <a href="#about" className="btn-outline">
              Decouvrir <FiArrowDown />
            </a>
            {cv && (
              <a href={`${API_BASE}${cv}`} target="_blank" rel="noopener noreferrer" download className="btn-cv">
                <FiDownload /> Telecharger CV
              </a>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container">
            <div className="hero-image-inner">
              {data.image ? (
                <img src={`${API_BASE}${data.image}`} alt={data.name} />
              ) : (
                <FaUserNurse className="placeholder-icon" />
              )}
            </div>
            <div className="hero-float-card card-1">
              <FaHeartbeat style={{ color: '#ef4444', marginRight: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem' }}>Soins de qualite</span>
            </div>
            <div className="hero-float-card card-2">
              <FaStethoscope style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem' }}>+1000 patients</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
