"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      mobile: { type: Sequelize.STRING, allowNull: true },
      role: { type: Sequelize.ENUM('admin','employee'), allowNull: false, defaultValue: 'employee' },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};