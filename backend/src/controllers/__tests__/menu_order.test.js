const request = require('supertest');
const appFactory = require('../../testApp');
const { sequelize } = require('../../../models');
const bcrypt = require('bcrypt');

let app, adminToken, empToken;

beforeAll(async () => {
  app = await appFactory();
  await sequelize.sync({ force: true });
  await sequelize.getQueryInterface().bulkInsert('users', [
    { name: 'Admin', email: 'admin@example.com', role: 'admin', password_hash: await bcrypt.hash('Admin@123', 10), created_at: new Date() },
    { name: 'Emp', email: 'emp@example.com', role: 'employee', password_hash: await bcrypt.hash('Emp@123', 10), created_at: new Date() },
  ]);
  adminToken = (await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'Admin@123' })).body.token
  empToken = (await request(app).post('/api/auth/login').send({ email: 'emp@example.com', password: 'Emp@123' })).body.token
});

afterAll(async () => { await sequelize.close(); });

test('admin can create menu', async () => {
  const res = await request(app)
    .post('/api/menus')
    .set('Authorization', `Bearer ${adminToken}`)
    .field('name', 'Tea')
    .field('price', '10');
  expect(res.statusCode).toBe(201);
  expect(res.body.menu).toBeTruthy();
});

test('employee can create order', async () => {
  const menus = await request(app).get('/api/menus').set('Authorization', `Bearer ${empToken}`)
  const menu = menus.body.menus[0]
  const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${empToken}`).send({ customer_name: 'John', items: [{ menu_id: menu.id, quantity: 2, unit_price: menu.price }] })
  expect(res.statusCode).toBe(201)
  expect(res.body.order.items.length).toBe(1)
});