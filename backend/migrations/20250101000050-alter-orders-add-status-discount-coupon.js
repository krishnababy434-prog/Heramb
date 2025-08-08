"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('orders');

    if (!tableDefinition.status) {
      await queryInterface.addColumn('orders', 'status', { type: Sequelize.ENUM('draft','submitted','cancelled'), allowNull: false, defaultValue: 'draft' });
    }

    if (!tableDefinition.discount) {
      await queryInterface.addColumn('orders', 'discount', { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 });
    }

    if (!tableDefinition.coupon_code) {
      await queryInterface.addColumn('orders', 'coupon_code', { type: Sequelize.STRING, allowNull: true });
    }
  },
  async down(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('orders');

    if (tableDefinition.coupon_code) {
      await queryInterface.removeColumn('orders', 'coupon_code');
    }

    if (tableDefinition.discount) {
      await queryInterface.removeColumn('orders', 'discount');
    }

    if (tableDefinition.status) {
      await queryInterface.removeColumn('orders', 'status');
    }

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status"');
    }
  }
};