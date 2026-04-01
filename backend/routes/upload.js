const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Configuration multer pour les images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorise. Utilisez JPG, PNG, GIF ou WEBP.'), false);
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Configuration multer pour le CV (PDF)
const cvFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorises pour le CV.'), false);
  }
};

const uploadCV = multer({
  storage: imageStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /api/upload - Upload d'image
router.post('/', authMiddleware, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoye' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
});

// POST /api/upload/cv - Upload de CV
router.post('/cv', authMiddleware, uploadCV.single('cv'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoye' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    console.error('Erreur upload CV:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload du CV' });
  }
});

module.exports = router;
