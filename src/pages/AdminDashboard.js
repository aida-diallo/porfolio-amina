import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiHome, FiUser, FiGrid, FiStar, FiBriefcase, FiBookOpen, FiMail,
  FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSave, FiLock, FiSettings,
  FiUpload, FiFileText, FiCheckCircle, FiMenu, FiX
} from 'react-icons/fi';
import { FaStethoscope } from 'react-icons/fa';
import * as api from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await api.getPortfolio();
      setData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
    toast.info('Deconnexion reussie');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: FiHome },
    { path: '/admin/hero', label: 'Hero / Accueil', icon: FiUser },
    { path: '/admin/about', label: 'A propos', icon: FiUser },
    { path: '/admin/services', label: 'Services', icon: FiGrid },
    { path: '/admin/skills', label: 'Competences', icon: FiStar },
    { path: '/admin/experiences', label: 'Experiences', icon: FiBriefcase },
    { path: '/admin/education', label: 'Formation', icon: FiBookOpen },
    { path: '/admin/contact', label: 'Contact', icon: FiMail },
    { path: '/admin/settings', label: 'Parametres', icon: FiSettings },
  ];

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}></div>;
  if (!data) return null;

  // ===== SUB COMPONENTS =====

  const DashboardHome = () => (
    <div>
      <div className="admin-header">
        <h2>Tableau de bord</h2>
        <button className="btn-logout" onClick={handleLogout}><FiLogOut /> Deconnexion</button>
      </div>
      <div className="admin-grid" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Competences', count: data.skills?.length || 0, icon: FiStar },
          { label: 'Experiences', count: data.experiences?.length || 0, icon: FiBriefcase },
          { label: 'Formations', count: data.education?.length || 0, icon: FiBookOpen },
          { label: 'Services', count: data.services?.length || 0, icon: FiGrid },
        ].map((item, i) => (
          <div key={i} className="admin-card" style={{ textAlign: 'center' }}>
            <item.icon style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{item.count}</div>
            <div style={{ color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h3>Bienvenue, {data.hero?.name || 'Amy'} !</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Utilisez le menu de gauche pour gerer les differentes sections de votre portfolio.
          Toutes les modifications sont enregistrees instantanement.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex' }}>
            Voir mon portfolio
          </a>
        </p>
      </div>
    </div>
  );

  const EditHero = () => {
    const [form, setForm] = useState({ ...data.hero });
    const handleSave = async () => {
      try {
        await api.updateHero(form);
        setData({ ...data, hero: form });
        toast.success('Hero mis a jour !');
      } catch (e) { toast.error('Erreur de sauvegarde'); }
    };
    return (
      <div>
        <div className="admin-header"><h2>Hero / Accueil</h2></div>
        <div className="admin-card">
          <div className="form-group">
            <label>Nom complet</label>
            <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Titre professionnel</label>
            <input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Sous-titre</label>
            <input value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <ImageUpload currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} />
          <button className="btn-save" onClick={handleSave}><FiSave style={{ marginRight: '0.5rem' }} />Sauvegarder</button>
        </div>
        <CVUpload currentCV={data.cv} onUpload={(url) => setData({ ...data, cv: url })} />
      </div>
    );
  };

  const CVUpload = ({ currentCV, onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

    const handleUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('cv', file);
        const res = await api.uploadCV(formData);
        onUpload(res.data.url);
        toast.success('CV uploade avec succes !');
      } catch (err) {
        toast.error('Erreur upload CV');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h3><FiFileText style={{ marginRight: '0.5rem' }} />CV (PDF)</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Uploadez votre CV au format PDF. Il sera disponible en telechargement sur votre portfolio.
        </p>
        {currentCV && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(74, 144, 217, 0.1)', borderRadius: '8px' }}>
            <FiCheckCircle style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>CV actuel :</span>
            <a href={`${API_BASE}${currentCV}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Voir le CV
            </a>
          </div>
        )}
        <label className="cv-upload-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition)' }}>
          <FiUpload />
          {uploading ? 'Upload en cours...' : (currentCV ? 'Remplacer le CV' : 'Uploader un CV')}
          <input type="file" accept=".pdf" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>
    );
  };

  const EditAbout = () => {
    const [form, setForm] = useState({ ...data.about });
    const handleSave = async () => {
      try {
        await api.updateAbout(form);
        setData({ ...data, about: form });
        toast.success('A propos mis a jour !');
      } catch (e) { toast.error('Erreur de sauvegarde'); }
    };
    return (
      <div>
        <div className="admin-header"><h2>A propos</h2></div>
        <div className="admin-card">
          <div className="form-group">
            <label>Description</label>
            <textarea rows="5" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <ImageUpload currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} />
          <h3 style={{ marginTop: '1.5rem' }}>Statistiques</h3>
          {(form.stats || []).map((stat, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className="form-group"><label>Valeur</label><input value={stat.value} onChange={e => { const stats = [...form.stats]; stats[i].value = e.target.value; setForm({ ...form, stats }); }} /></div>
              <div className="form-group"><label>Label</label><input value={stat.label} onChange={e => { const stats = [...form.stats]; stats[i].label = e.target.value; setForm({ ...form, stats }); }} /></div>
            </div>
          ))}
          <button className="btn-save" onClick={handleSave}><FiSave style={{ marginRight: '0.5rem' }} />Sauvegarder</button>
        </div>
      </div>
    );
  };

  const EditContact = () => {
    const [form, setForm] = useState({ ...data.contact });
    const handleSave = async () => {
      try {
        await api.updateContact(form);
        setData({ ...data, contact: form });
        toast.success('Contact mis a jour !');
      } catch (e) { toast.error('Erreur de sauvegarde'); }
    };
    return (
      <div>
        <div className="admin-header"><h2>Contact</h2></div>
        <div className="admin-card">
          {['email', 'phone', 'location', 'linkedin', 'availability'].map(field => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <button className="btn-save" onClick={handleSave}><FiSave style={{ marginRight: '0.5rem' }} />Sauvegarder</button>
        </div>
      </div>
    );
  };

  // Generic CRUD section
  const CrudSection = ({ title, items, fields, apiAdd, apiUpdate, apiDelete, dataKey }) => {
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});

    const openAdd = () => {
      const empty = {};
      fields.forEach(f => { empty[f.key] = f.default || ''; });
      setFormData(empty);
      setEditItem('new');
    };

    const openEdit = (item) => {
      setFormData({ ...item });
      setEditItem(item.id);
    };

    const handleSave = async () => {
      try {
        if (editItem === 'new') {
          const res = await apiAdd(formData);
          setData(prev => ({ ...prev, [dataKey]: [...prev[dataKey], res.data.data] }));
          toast.success('Ajoute avec succes !');
        } else {
          await apiUpdate(editItem, formData);
          setData(prev => ({
            ...prev,
            [dataKey]: prev[dataKey].map(i => i.id === editItem ? { ...i, ...formData } : i)
          }));
          toast.success('Mis a jour !');
        }
        setEditItem(null);
      } catch (e) { toast.error('Erreur de sauvegarde'); }
    };

    const handleDelete = async (id) => {
      if (!window.confirm('Supprimer cet element ?')) return;
      try {
        await apiDelete(id);
        setData(prev => ({ ...prev, [dataKey]: prev[dataKey].filter(i => i.id !== id) }));
        toast.success('Supprime !');
      } catch (e) { toast.error('Erreur de suppression'); }
    };

    return (
      <div>
        <div className="admin-header">
          <h2>{title}</h2>
          <button className="btn-add" onClick={openAdd}><FiPlus /> Ajouter</button>
        </div>
        <div className="admin-grid">
          {(items || []).map(item => (
            <div key={item.id} className="admin-item">
              <h4>{item[fields[0].key]}</h4>
              {fields[1] && <p>{item[fields[1].key]}</p>}
              <div className="admin-item-actions">
                <button className="btn-sm btn-edit" onClick={() => openEdit(item)}><FiEdit2 /> Modifier</button>
                <button className="btn-sm btn-delete" onClick={() => handleDelete(item.id)}><FiTrash2 /> Supprimer</button>
              </div>
            </div>
          ))}
        </div>
        {editItem && (
          <div className="modal-overlay" onClick={() => setEditItem(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editItem === 'new' ? 'Ajouter' : 'Modifier'}</h3>
              {fields.map(field => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} />
                  ) : field.type === 'number' ? (
                    <input type="number" min="0" max="100" value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: parseInt(e.target.value) || 0 })} />
                  ) : (
                    <input value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} />
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditItem(null)}>Annuler</button>
                <button className="btn-save" onClick={handleSave}><FiSave style={{ marginRight: '0.5rem' }} />Sauvegarder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ImageUpload = ({ currentImage, onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

    const handleUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.uploadImage(formData);
        onUpload(res.data.url);
        toast.success('Image uploadee !');
      } catch (err) {
        toast.error('Erreur upload');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="form-group">
        <label>Image</label>
        {currentImage && (
          <img src={`${API_BASE}${currentImage}`} alt="" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.5rem', display: 'block' }} />
        )}
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ padding: '0.5rem' }} />
        {uploading && <p style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Upload en cours...</p>}
      </div>
    );
  };

  const Settings = () => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);

    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (form.newPassword !== form.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
      setSaving(true);
      try {
        await api.changePassword(form.currentPassword, form.newPassword);
        toast.success('Mot de passe modifie !');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Erreur');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div>
        <div className="admin-header"><h2>Parametres</h2></div>
        <div className="admin-card">
          <h3><FiLock style={{ marginRight: '0.5rem' }} />Changer le mot de passe</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <input type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-layout">
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h3><FaStethoscope style={{ marginRight: '0.5rem' }} />Amy Admin</h3>
          <p>Gestion du portfolio</p>
        </div>
        <ul className="admin-nav">
          {navItems.map(item => (
            <li key={item.path}>
              <Link to={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
                <item.icon /> {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ padding: '1.5rem' }}>
          <button className="btn-logout" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <FiLogOut /> Deconnexion
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="hero" element={<EditHero />} />
          <Route path="about" element={<EditAbout />} />
          <Route path="contact" element={<EditContact />} />
          <Route path="skills" element={
            <CrudSection
              title="Competences"
              items={data.skills}
              dataKey="skills"
              apiAdd={api.addSkill}
              apiUpdate={api.updateSkill}
              apiDelete={api.deleteSkill}
              fields={[
                { key: 'name', label: 'Nom de la competence', default: '' },
                { key: 'level', label: 'Niveau (0-100)', type: 'number', default: 50 },
              ]}
            />
          } />
          <Route path="services" element={
            <CrudSection
              title="Services"
              items={data.services}
              dataKey="services"
              apiAdd={api.addService}
              apiUpdate={api.updateService}
              apiDelete={api.deleteService}
              fields={[
                { key: 'title', label: 'Titre du service', default: '' },
                { key: 'description', label: 'Description', type: 'textarea', default: '' },
                { key: 'icon', label: 'Icone (home, hospital, education, emergency)', default: 'hospital' },
              ]}
            />
          } />
          <Route path="experiences" element={
            <CrudSection
              title="Experiences"
              items={data.experiences}
              dataKey="experiences"
              apiAdd={api.addExperience}
              apiUpdate={api.updateExperience}
              apiDelete={api.deleteExperience}
              fields={[
                { key: 'title', label: 'Poste', default: '' },
                { key: 'company', label: 'Entreprise / Etablissement', default: '' },
                { key: 'location', label: 'Lieu', default: '' },
                { key: 'startDate', label: 'Date de debut', default: '' },
                { key: 'endDate', label: 'Date de fin', default: '' },
                { key: 'description', label: 'Description', type: 'textarea', default: '' },
              ]}
            />
          } />
          <Route path="education" element={
            <CrudSection
              title="Formation"
              items={data.education}
              dataKey="education"
              apiAdd={api.addEducation}
              apiUpdate={api.updateEducation}
              apiDelete={api.deleteEducation}
              fields={[
                { key: 'degree', label: 'Diplome', default: '' },
                { key: 'school', label: 'Etablissement', default: '' },
                { key: 'year', label: 'Annee', default: '' },
                { key: 'description', label: 'Description', type: 'textarea', default: '' },
              ]}
            />
          } />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<DashboardHome />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
