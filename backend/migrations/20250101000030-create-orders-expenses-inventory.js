"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_name: { type: Sequelize.STRING, allowNull: false },
      mobile: { type: Sequelize.STRING, allowNull: true },
      subtotal: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      tax: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      total: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      created_by: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('orders', ['created_by']);
    await queryInterface.addIndex('orders', ['created_at']);
    await queryInterface.addIndex('orders', ['mobile']);

    await queryInterface.createTable("order_items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE' },
      menu_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'menus', key: 'id' }, onDelete: 'SET NULL' },
      combo_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'combo_menus', key: 'id' }, onDelete: 'SET NULL' },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
    });

    await queryInterface.createTable("expenses", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      note: { type: Sequelize.TEXT, allowNull: true },
      employee_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      category: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('expenses', ['employee_id']);
    await queryInterface.addIndex('expenses', ['created_at']);

    await queryInterface.createTable("inventory", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      threshold_alert: { type: Sequelize.DECIMAL(10,2), allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('inventory', ['name']);
    await queryInterface.addIndex('inventory', ['updated_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('expenses');
    await queryInterface.dropTable('inventory');
  }
};