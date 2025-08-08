require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { PORT = 4000, UPLOAD_DIR = './uploads' } = process.env;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static file serving for uploads
const uploadPath = path.resolve(process.cwd(), UPLOAD_DIR);
app.use('/uploads', express.static(uploadPath));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('../src/routes/auth'));
app.use('/api/admin', require('../src/routes/admin'));
app.use('/api/menus', require('../src/routes/menus'));
app.use('/api/combos', require('../src/routes/combos'));
app.use('/api/orders', require('../src/routes/orders'));
app.use('/api/expenses', require('../src/routes/expenses'));
app.use('/api/inventory', require('../src/routes/inventory'));
app.use('/api/uploads', require('../src/routes/uploads'));
app.use('/api/coupons', require('../src/routes/coupons'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});