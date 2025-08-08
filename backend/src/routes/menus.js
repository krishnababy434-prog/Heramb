const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Menu } = require('../../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });

router.get('/', authenticate, async (req, res) => {
  const menus = await Menu.findAll({ order: [['created_at','DESC']] });
  res.json({ menus });
});

router.post('/', authenticate, isAdmin,
  upload.single('photo'),
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, description, price, is_available = true } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const menu = await Menu.create({ name, description, price, is_available: !!JSON.parse(is_available), photo_url });
    res.status(201).json({ menu });
  }
);

router.put('/:id', authenticate, isAdmin,
  upload.single('photo'),
  async (req, res) => {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    const { name, description, price, is_available } = req.body;
    let photo_url = menu.photo_url;
    if (req.file) photo_url = `/uploads/${req.file.filename}`;
    await menu.update({
      name: name ?? menu.name,
      description: description ?? menu.description,
      price: price ?? menu.price,
      is_available: typeof is_available !== 'undefined' ? !!JSON.parse(is_available) : menu.is_available,
      photo_url,
    });
    res.json({ menu });
  }
);

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const menu = await Menu.findByPk(req.params.id);
  if (!menu) return res.status(404).json({ message: 'Menu not found' });
  await menu.destroy();
  res.json({ success: true });
});

module.exports = router;