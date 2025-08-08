const express = require('express');
const { body, validationResult } = require('express-validator');
const { Inventory } = require('../../models');
const { authenticate, isEmployeeOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, isEmployeeOrAdmin, async (req, res) => {
  const { q } = req.query;
  const where = {};
  if (q) where.name = q;
  const items = await Inventory.findAll({ where, order: [['updated_at','DESC']] });
  res.json({ items });
});

router.post('/', authenticate, isEmployeeOrAdmin,
  body('name').notEmpty(),
  body('unit').notEmpty(),
  body('quantity').isFloat(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, unit, quantity, threshold_alert } = req.body;
    const item = await Inventory.create({ name, unit, quantity, threshold_alert });
    res.status(201).json({ item });
  }
);

router.put('/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
  const item = await Inventory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  const { name, unit, quantity, threshold_alert } = req.body;
  await item.update({
    name: name ?? item.name,
    unit: unit ?? item.unit,
    quantity: typeof quantity !== 'undefined' ? quantity : item.quantity,
    threshold_alert: typeof threshold_alert !== 'undefined' ? threshold_alert : item.threshold_alert,
  });
  res.json({ item });
});

router.post('/:id/adjust', authenticate, isEmployeeOrAdmin,
  body('delta').isFloat(),
  async (req, res) => {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const delta = Number(req.body.delta);
    await item.update({ quantity: Number(item.quantity) + delta });
    res.json({ item });
  }
);

module.exports = router;