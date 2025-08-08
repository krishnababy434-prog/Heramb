const request = require('supertest');
const appFactory = require('../../testApp');
const { sequelize } = require('../../../models');
const bcrypt = require('bcrypt');

let app;
let token;

beforeAll(async () => {
  app = await appFactory();
  await sequelize.sync({ force: true });
  await sequelize.getQueryInterface().bulkInsert('users', [{
    name: 'Admin', email: 'admin@example.com', role: 'admin', password_hash: await bcrypt.hash('Admin@123', 10), created_at: new Date()
  }]);
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'Admin@123' });
  token = res.body.token;
});

afterAll(async () => { await sequelize.close(); });

test('admin can create employee', async () => {
  const res = await request(app).post('/api/admin/employees').set('Authorization', `Bearer ${token}`).send({ name: 'Emp', email: 'emp@example.com', password: 'Secret@123' });
  expect(res.statusCode).toBe(201);
  expect(res.body.id).toBeTruthy();
});