import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', 'about', 'services', 'skills', 'experience', 'education', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && el.offsetTop - 200 <= window.scrollY) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
        Amy<span>.</span>Diallo
      </div>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {[
          { id: 'about', label: 'A propos' },
          { id: 'services', label: 'Services' },
          { id: 'skills', label: 'Competences' },
          { id: 'experience', label: 'Experience' },
          { id: 'education', label: 'Formation' },
          { id: 'contact', label: 'Contact' },
        ].map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}
              style={{ cursor: 'pointer' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>
    </nav>
  );
};

export default Navbar;
