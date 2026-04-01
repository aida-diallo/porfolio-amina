const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'admin.json');

// Initialiser le fichier admin si inexistant
function initAdmin() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const admin = {
      email: process.env.ADMIN_EMAIL || 'myadiallo677@gmail.com',
      password: hashedPassword
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(admin, null, 2));
  }
}

initAdmin();

function getAdmin() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveAdmin(admin) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(admin, null, 2));
}

// Middleware d'authentification
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expire' });
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = getAdmin();

    if (email !== admin.email) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = getAdmin();

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    saveAdmin(admin);

    res.json({ message: 'Mot de passe modifie avec succes' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
