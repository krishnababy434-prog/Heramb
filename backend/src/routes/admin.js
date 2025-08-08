const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, isAdmin);

router.get('/employees', async (req, res) => {
  const employees = await User.findAll({ where: { role: 'employee' }, attributes: ['id','name','email','mobile','role','created_at'] });
  res.json({ employees });
});

router.post('/employees',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, mobile } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, role: 'employee', password_hash });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, mobile: user.mobile });
  }
);

router.put('/employees/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user || user.role !== 'employee') return res.status(404).json({ message: 'Employee not found' });
  const { name, email, mobile } = req.body;
  await user.update({ name: name ?? user.name, email: email ?? user.email, mobile: mobile ?? user.mobile });
  res.json({ id: user.id, name: user.name, email: user.email, mobile: user.mobile });
});

router.delete('/employees/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user || user.role !== 'employee') return res.status(404).json({ message: 'Employee not found' });
  await user.destroy();
  res.json({ success: true });
});

module.exports = router;