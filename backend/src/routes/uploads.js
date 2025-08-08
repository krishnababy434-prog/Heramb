const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});
const fileFilter = (req, file, cb) => {
  if (['image/jpeg','image/png','image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 3*1024*1024 } });

router.post('/', authenticate, isAdmin, upload.single('file'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;