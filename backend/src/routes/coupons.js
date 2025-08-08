const express = require('express');
const { body, validationResult } = require('express-validator');
const { Coupon } = require('../../models');
const { authenticate, isAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin','manager'), async (req, res) => {
  const coupons = await Coupon.findAll({ order: [['created_at','DESC']] });
  res.json({ coupons });
});

router.get('/validate', authenticate, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'code is required' });
  const now = new Date();
  const coupon = await Coupon.findOne({ where: { code } });
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
  if (!coupon.is_active) return res.status(400).json({ message: 'Coupon inactive' });
  if (coupon.start_date > now || coupon.end_date < now) return res.status(400).json({ message: 'Coupon expired' });
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return res.status(400).json({ message: 'Coupon limit reached' });
  res.json({ coupon });
});

router.post('/', authenticate, isAdmin,
  body('code').notEmpty(),
  body('type').isIn(['percentage','fixed']),
  body('value').isFloat({ gt: 0 }),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const payload = req.body;
    const exists = await Coupon.findOne({ where: { code: payload.code } });
    if (exists) return res.status(409).json({ message: 'Code already exists' });
    const coupon = await Coupon.create(payload);
    res.status(201).json({ coupon });
  }
);

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Not found' });
  await coupon.update(req.body);
  res.json({ coupon });
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Not found' });
  await coupon.destroy();
  res.json({ success: true });
});

module.exports = router;