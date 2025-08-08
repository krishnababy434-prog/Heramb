"use strict";
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password_hash = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'admin@example.com',
      mobile: '9999999999',
      role: 'admin',
      password_hash,
      created_at: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' });
  }
};