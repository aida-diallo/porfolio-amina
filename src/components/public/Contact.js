import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiSend } from 'react-icons/fi';
import { sendContact } from '../../services/api';

const Contact = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await sendContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="section-header">
          <h2>Me <span className="highlight">Contacter</span></h2>
          <p>{data.availability}</p>
          <div className="section-line"></div>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><FiMail /></div>
              <div>
                <h4>Email</h4>
                <p>{data.email}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><FiPhone /></div>
              <div>
                <h4>Telephone</h4>
                <p>{data.phone}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><FiMapPin /></div>
              <div>
                <h4>Localisation</h4>
                <p>{data.location}</p>
              </div>
            </div>
            {data.linkedin && (
              <div className="contact-item">
                <div className="contact-icon"><FiLinkedin /></div>
                <div>
                  <h4>LinkedIn</h4>
                  <p><a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>Voir mon profil</a></p>
                </div>
              </div>
            )}
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {status === 'success' && (
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10b981', marginBottom: '1rem' }}>
                Message envoye avec succes !
              </div>
            )}
            {status === 'error' && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', marginBottom: '1rem' }}>
                Erreur lors de l'envoi. Veuillez reessayer.
              </div>
            )}
            <input
              type="text"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Votre message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={sending}>
              <FiSend /> {sending ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
