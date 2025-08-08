const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  }
);

router.post('/register', authenticate, isAdmin,
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['employee','admin']).optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, role = 'employee', mobile } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, role, password_hash });
    res.status(201).json({ id: user.id, name: user.name, role: user.role, email: user.email });
  }
);

router.get('/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id','name','email','role'] });
  res.json({ user });
});

module.exports = router;