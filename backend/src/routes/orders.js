const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Menu, ComboMenu, User } = require('../../models');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

const TAX_RATE = parseFloat(process.env.TAX_RATE || '0.0');

router.post('/', authenticate, authorizeRoles('seller','admin'),
  body('customer_name').notEmpty(),
  body('items').isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { customer_name, mobile, items } = req.body;

    let subtotal = 0;
    for (const it of items) {
      if (it.menu_id) {
        const menu = await Menu.findByPk(it.menu_id);
        if (!menu) return res.status(400).json({ message: `Menu ${it.menu_id} not found` });
        subtotal += Number(menu.price) * Number(it.quantity);
      } else if (it.combo_id) {
        const combo = await ComboMenu.findByPk(it.combo_id);
        if (!combo) return res.status(400).json({ message: `Combo ${it.combo_id} not found` });
        subtotal += Number(combo.price) * Number(it.quantity);
      }
    }
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const order = await Order.create({ customer_name, mobile, subtotal, tax, total, created_by: req.user.id });
    for (const it of items) {
      await OrderItem.create({
        order_id: order.id,
        menu_id: it.menu_id || null,
        combo_id: it.combo_id || null,
        quantity: it.quantity,
        unit_price: it.unit_price || 0,
      });
      // TODO: decrement inventory based on menu/combo composition
    }

    const created = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.status(201).json({ order: created });
  }
);

router.get('/', authenticate, authorizeRoles('seller','manager','admin'), async (req, res) => {
  const { from, to, employee_id, mobile, limit = 20, offset = 0 } = req.query;
  const where = {};
  if (mobile) where.mobile = mobile;
  if (employee_id) where.created_by = employee_id;
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at['$gte'] = new Date(from);
    if (to) where.created_at['$lte'] = new Date(to);
  }
  const orders = await Order.findAll({
    where,
    limit: Number(limit),
    offset: Number(offset),
    order: [['created_at','DESC']],
    include: [{ model: OrderItem, as: 'items' }],
  });
  res.json({ orders });
});

module.exports = router;