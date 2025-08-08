const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin only' });
};

const isEmployeeOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'employee' || req.user.role === 'admin')) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

const isSeller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') return next();
  return res.status(403).json({ message: 'Seller only' });
};

const isManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') return next();
  return res.status(403).json({ message: 'Manager only' });
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = { authenticate, isAdmin, isSeller, isManager, authorizeRoles };