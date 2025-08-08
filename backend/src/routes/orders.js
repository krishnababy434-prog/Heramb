const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, OrderItem, Menu, ComboMenu, User, Coupon } = require('../../models');
const { authenticate, isEmployeeOrAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

const TAX_RATE = parseFloat(process.env.TAX_RATE || '0.0');

async function recalcOrderTotals(order) {
  const items = await OrderItem.findAll({ where: { order_id: order.id } });
  const subtotal = items.reduce((sum, it) => sum + Number(it.unit_price) * Number(it.quantity), 0);
  let discount = 0;
  if (order.coupon_code) {
    const coupon = await Coupon.findOne({ where: { code: order.coupon_code } });
    const now = new Date();
    if (coupon && coupon.is_active && coupon.start_date <= now && coupon.end_date >= now && (!coupon.max_uses || coupon.used_count < coupon.max_uses)) {
      if (coupon.type === 'percentage') discount = +(subtotal * (Number(coupon.value) / 100)).toFixed(2);
      else discount = +Number(coupon.value).toFixed(2);
      if (discount > subtotal) discount = subtotal;
    } else {
      // invalidate invalid coupon
      order.coupon_code = null;
    }
  }
  const taxable = subtotal - discount;
  const tax = +(taxable * TAX_RATE).toFixed(2);
  const total = +(taxable + tax).toFixed(2);
  await order.update({ subtotal, discount, tax, total });
  return { subtotal, discount, tax, total };
}

// Create a final order directly
router.post('/', authenticate, isEmployeeOrAdmin,
  body('customer_name').notEmpty(),
  body('items').isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { customer_name, mobile, items, coupon_code } = req.body;

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
    let discount = 0;
    if (coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: coupon_code } });
      const now = new Date();
      if (!coupon || !coupon.is_active || coupon.start_date > now || coupon.end_date < now || (coupon.max_uses && coupon.used_count >= coupon.max_uses)) {
        return res.status(400).json({ message: 'Invalid coupon' });
      }
      discount = coupon.type === 'percentage' ? +(subtotal * (Number(coupon.value)/100)).toFixed(2) : +Number(coupon.value).toFixed(2);
      if (discount > subtotal) discount = subtotal;
      await coupon.update({ used_count: coupon.used_count + 1 });
    }
    const taxable = subtotal - discount;
    const tax = +(taxable * TAX_RATE).toFixed(2);
    const total = +(taxable + tax).toFixed(2);

    const order = await Order.create({ customer_name, mobile, subtotal, tax, total, discount, coupon_code: coupon_code || null, status: 'submitted', created_by: req.user.id });
    for (const it of items) {
      await OrderItem.create({
        order_id: order.id,
        menu_id: it.menu_id || null,
        combo_id: it.combo_id || null,
        quantity: it.quantity,
        unit_price: it.unit_price || 0,
      });
    }

    const created = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.status(201).json({ order: created });
  }
);

// Draft order endpoints
router.get('/current', authenticate, authorizeRoles('seller','admin'), async (req, res) => {
  let order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' }, include: [{ model: OrderItem, as: 'items' }] });
  if (!order) {
    order = await Order.create({ customer_name: 'Walk-in', subtotal: 0, tax: 0, total: 0, discount: 0, status: 'draft', created_by: req.user.id });
    order = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
  }
  res.json({ order });
});

router.post('/current/items', authenticate, authorizeRoles('seller','admin'),
  body('menu_id').optional().isInt(),
  body('combo_id').optional().isInt(),
  body('quantity').isInt({ gt: 0 }),
  async (req, res) => {
    let order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' } });
    if (!order) order = await Order.create({ customer_name: 'Walk-in', subtotal: 0, tax: 0, total: 0, discount: 0, status: 'draft', created_by: req.user.id });
    const { menu_id, combo_id, quantity } = req.body;
    if (!menu_id && !combo_id) return res.status(400).json({ message: 'menu_id or combo_id required' });
    let unit_price = 0;
    if (menu_id) {
      const menu = await Menu.findByPk(menu_id);
      if (!menu) return res.status(400).json({ message: 'Menu not found' });
      unit_price = Number(menu.price);
    } else if (combo_id) {
      const combo = await ComboMenu.findByPk(combo_id);
      if (!combo) return res.status(400).json({ message: 'Combo not found' });
      unit_price = Number(combo.price);
    }
    const item = await OrderItem.create({ order_id: order.id, menu_id: menu_id || null, combo_id: combo_id || null, quantity, unit_price });
    await recalcOrderTotals(order);
    const updated = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.status(201).json({ order: updated, item });
  }
);

router.patch('/current/items/:id', authenticate, authorizeRoles('seller','admin'),
  body('quantity').optional().isInt({ gt: 0 }),
  async (req, res) => {
    const order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' } });
    if (!order) return res.status(404).json({ message: 'No draft order' });
    const item = await OrderItem.findByPk(req.params.id);
    if (!item || item.order_id !== order.id) return res.status(404).json({ message: 'Item not found' });
    const { quantity } = req.body;
    if (typeof quantity !== 'undefined') await item.update({ quantity });
    await recalcOrderTotals(order);
    const updated = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.json({ order: updated });
  }
);

router.delete('/current/items/:id', authenticate, authorizeRoles('seller','admin'), async (req, res) => {
  const order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' } });
  if (!order) return res.status(404).json({ message: 'No draft order' });
  const item = await OrderItem.findByPk(req.params.id);
  if (!item || item.order_id !== order.id) return res.status(404).json({ message: 'Item not found' });
  await item.destroy();
  await recalcOrderTotals(order);
  const updated = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
  res.json({ order: updated });
});

router.post('/current/apply-coupon', authenticate, authorizeRoles('seller','admin'),
  body('code').notEmpty(),
  async (req, res) => {
    const order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' } });
    if (!order) return res.status(404).json({ message: 'No draft order' });
    const { code } = req.body;
    const coupon = await Coupon.findOne({ where: { code } });
    const now = new Date();
    if (!coupon || !coupon.is_active || coupon.start_date > now || coupon.end_date < now || (coupon.max_uses && coupon.used_count >= coupon.max_uses)) {
      return res.status(400).json({ message: 'Invalid coupon' });
    }
    await order.update({ coupon_code: code });
    const totals = await recalcOrderTotals(order);
    const updated = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.json({ order: updated });
  }
);

router.post('/submit', authenticate, authorizeRoles('seller','admin'),
  body('customer_name').notEmpty(),
  body('mobile').optional().isString(),
  async (req, res) => {
    const order = await Order.findOne({ where: { created_by: req.user.id, status: 'draft' } });
    if (!order) return res.status(404).json({ message: 'No draft order' });
    const { customer_name, mobile } = req.body;
    await recalcOrderTotals(order);
    await order.update({ customer_name, mobile: mobile || null, status: 'submitted' });
    if (order.coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: order.coupon_code } });
      if (coupon) await coupon.update({ used_count: coupon.used_count + 1 });
    }
    const updated = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items' }] });
    res.json({ order: updated });
  }
);

router.get('/', authenticate, authorizeRoles('seller','manager','admin'), async (req, res) => {
  const { from, to, employee_id, mobile, limit = 20, offset = 0 } = req.query;
  const where = {};
  if (mobile) where.mobile = mobile;
  if (employee_id) where.created_by = employee_id;
  if (req.user.role === 'seller') where.created_by = req.user.id;
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