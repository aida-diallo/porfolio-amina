import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import { FiLock, FiMail } from 'react-icons/fi';
import { FaStethoscope } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      localStorage.setItem('admin_token', response.data.token);
      toast.success('Connexion reussie !');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <FaStethoscope style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
        </div>
        <h2>Administration</h2>
        <p className="subtitle">Gerez votre portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiMail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label><FiLock style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          <button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <a href="/" style={{ color: 'var(--primary-light)' }}>Retour au portfolio</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
