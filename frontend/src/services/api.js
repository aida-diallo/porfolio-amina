import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-amina-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rediriger vers login si token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getPortfolio = () => api.get('/portfolio');
export const login = (email, password) => api.post('/auth/login', { email, password });
export const changePassword = (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword });
export const updateHero = (data) => api.put('/portfolio/hero', data);
export const updateAbout = (data) => api.put('/portfolio/about', data);
export const updateContact = (data) => api.put('/portfolio/contact', data);
export const addSkill = (data) => api.post('/portfolio/skills', data);
export const updateSkill = (id, data) => api.put(`/portfolio/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/portfolio/skills/${id}`);
export const addExperience = (data) => api.post('/portfolio/experiences', data);
export const updateExperience = (id, data) => api.put(`/portfolio/experiences/${id}`, data);
export const deleteExperience = (id) => api.delete(`/portfolio/experiences/${id}`);
export const addEducation = (data) => api.post('/portfolio/education', data);
export const updateEducation = (id, data) => api.put(`/portfolio/education/${id}`, data);
export const deleteEducation = (id) => api.delete(`/portfolio/education/${id}`);
export const addService = (data) => api.post('/portfolio/services', data);
export const updateService = (id, data) => api.put(`/portfolio/services/${id}`, data);
export const deleteService = (id) => api.delete(`/portfolio/services/${id}`);
export const uploadImage = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadCV = (formData) => api.post('/upload/cv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const sendContact = (data) => api.post('/contact', data);

export default api;
