const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ComboMenu, ComboItem, Menu } = require('../../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (['image/jpeg','image/png','image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 3*1024*1024 } });

router.get('/', authenticate, async (req, res) => {
  const combos = await ComboMenu.findAll({ include: [{ model: ComboItem, as: 'items' }], order: [['created_at','DESC']] });
  res.json({ combos });
});

router.post('/', authenticate, isAdmin, upload.single('photo'),
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, price, items = '[]' } = req.body;
    const parsedItems = JSON.parse(items);
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const combo = await ComboMenu.create({ name, price, photo_url });
    for (const it of parsedItems) {
      await ComboItem.create({ combo_id: combo.id, menu_id: it.menu_id, quantity: it.quantity || 1 });
    }
    const withItems = await ComboMenu.findByPk(combo.id, { include: [{ model: ComboItem, as: 'items' }] });
    res.status(201).json({ combo: withItems });
  }
);

router.put('/:id', authenticate, isAdmin, upload.single('photo'), async (req, res) => {
  const combo = await ComboMenu.findByPk(req.params.id);
  if (!combo) return res.status(404).json({ message: 'Combo not found' });
  const { name, price, items } = req.body;
  let photo_url = combo.photo_url;
  if (req.file) photo_url = `/uploads/${req.file.filename}`;
  await combo.update({ name: name ?? combo.name, price: price ?? combo.price, photo_url });
  if (items) {
    const parsed = JSON.parse(items);
    await ComboItem.destroy({ where: { combo_id: combo.id } });
    for (const it of parsed) {
      await ComboItem.create({ combo_id: combo.id, menu_id: it.menu_id, quantity: it.quantity || 1 });
    }
  }
  const withItems = await ComboMenu.findByPk(combo.id, { include: [{ model: ComboItem, as: 'items' }] });
  res.json({ combo: withItems });
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const combo = await ComboMenu.findByPk(req.params.id);
  if (!combo) return res.status(404).json({ message: 'Combo not found' });
  await ComboItem.destroy({ where: { combo_id: combo.id } });
  await combo.destroy();
  res.json({ success: true });
});

module.exports = router;