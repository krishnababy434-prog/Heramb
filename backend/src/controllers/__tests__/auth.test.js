const request = require('supertest');
const appFactory = require('../../testApp');
const { sequelize } = require('../../../models');

let app;

beforeAll(async () => {
  app = await appFactory();
  await sequelize.sync({ force: true });
  // seed admin
  const bcrypt = require('bcrypt');
  await sequelize.getQueryInterface().bulkInsert('users', [{
    name: 'Admin', email: 'admin@example.com', mobile: '9999999999', role: 'admin', password_hash: await bcrypt.hash('Admin@123', 10), created_at: new Date()
  }]);
});

afterAll(async () => {
  await sequelize.close();
});

test('login works', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'Admin@123' });
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeTruthy();
});