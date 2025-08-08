require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

module.exports = async function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/menus', require('./routes/menus'));
  app.use('/api/combos', require('./routes/combos'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/expenses', require('./routes/expenses'));
  app.use('/api/inventory', require('./routes/inventory'));
  app.use('/api/coupons', require('./routes/coupons'));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  return app;
}