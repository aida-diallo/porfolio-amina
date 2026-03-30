import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Amy Diallo - Infirmiere Diplomee d'Etat
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
        Fait avec <FaHeartbeat className="heart" style={{ verticalAlign: 'middle' }} /> et passion
      </p>
      <Link
        to="/admin/login"
        className="admin-access-btn"
        title="Administration"
      >
        <FiSettings />
      </Link>
    </footer>
  );
};

export default Footer;
