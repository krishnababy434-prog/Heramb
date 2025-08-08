"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'status', { type: Sequelize.ENUM('draft','submitted','cancelled'), allowNull: false, defaultValue: 'draft' });
    await queryInterface.addColumn('orders', 'discount', { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 });
    await queryInterface.addColumn('orders', 'coupon_code', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'coupon_code');
    await queryInterface.removeColumn('orders', 'discount');
    await queryInterface.removeColumn('orders', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status"');
  }
};