const express = require('express');
const { body, validationResult } = require('express-validator');
const { Expense } = require('../../models');
const { authenticate, isEmployeeOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, isEmployeeOrAdmin,
  body('title').notEmpty(),
  body('amount').isFloat({ gt: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, amount, note, category } = req.body;
    const expense = await Expense.create({ title, amount, note, category, employee_id: req.user.id });
    res.status(201).json({ expense });
  }
);

router.get('/', authenticate, isEmployeeOrAdmin, async (req, res) => {
  const { from, to, employee_id, limit = 20, offset = 0 } = req.query;
  const where = {};
  if (employee_id) where.employee_id = employee_id;
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at['$gte'] = new Date(from);
    if (to) where.created_at['$lte'] = new Date(to);
  }
  const expenses = await Expense.findAll({ where, limit: Number(limit), offset: Number(offset), order: [['created_at','DESC']] });
  res.json({ expenses });
});

module.exports = router;