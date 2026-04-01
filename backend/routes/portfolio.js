const express = require('express');
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('./auth');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'portfolio.json');

// Donnees par defaut du portfolio
const defaultData = {
  hero: {
    name: 'Amy Diallo',
    title: 'Infirmiere Diplomee',
    subtitle: 'Passionnee par le soin et le bien-etre des patients',
    image: ''
  },
  about: {
    description: '',
    image: '',
    cv: ''
  },
  contact: {
    email: 'myadiallo677@gmail.com',
    phone: '',
    address: ''
  },
  skills: [],
  experiences: [],
  education: [],
  services: []
};

function initData() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

initData();

function getData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/portfolio
router.get('/', (req, res) => {
  try {
    const data = getData();
    res.json(data);
  } catch (error) {
    console.error('Erreur lecture portfolio:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/hero
router.put('/hero', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.hero = { ...data.hero, ...req.body };
    saveData(data);
    res.json(data.hero);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/about
router.put('/about', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.about = { ...data.about, ...req.body };
    saveData(data);
    res.json(data.about);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/contact
router.put('/contact', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.contact = { ...data.contact, ...req.body };
    saveData(data);
    res.json(data.contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Skills ---
router.post('/skills', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const skill = { id: Date.now().toString(), ...req.body };
    data.skills.push(skill);
    saveData(data);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/skills/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const index = data.skills.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Competence non trouvee' });
    data.skills[index] = { ...data.skills[index], ...req.body };
    saveData(data);
    res.json(data.skills[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/skills/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.skills = data.skills.filter(s => s.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Competence supprimee' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Experiences ---
router.post('/experiences', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const exp = { id: Date.now().toString(), ...req.body };
    data.experiences.push(exp);
    saveData(data);
    res.status(201).json(exp);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/experiences/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const index = data.experiences.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Experience non trouvee' });
    data.experiences[index] = { ...data.experiences[index], ...req.body };
    saveData(data);
    res.json(data.experiences[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/experiences/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.experiences = data.experiences.filter(e => e.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Experience supprimee' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Education ---
router.post('/education', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const edu = { id: Date.now().toString(), ...req.body };
    data.education.push(edu);
    saveData(data);
    res.status(201).json(edu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/education/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const index = data.education.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Formation non trouvee' });
    data.education[index] = { ...data.education[index], ...req.body };
    saveData(data);
    res.json(data.education[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/education/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.education = data.education.filter(e => e.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Formation supprimee' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Services ---
router.post('/services', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const service = { id: Date.now().toString(), ...req.body };
    data.services.push(service);
    saveData(data);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/services/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    const index = data.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Service non trouve' });
    data.services[index] = { ...data.services[index], ...req.body };
    saveData(data);
    res.json(data.services[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/services/:id', authMiddleware, (req, res) => {
  try {
    const data = getData();
    data.services = data.services.filter(s => s.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Service supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
