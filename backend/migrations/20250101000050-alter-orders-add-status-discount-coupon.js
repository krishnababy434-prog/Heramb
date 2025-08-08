"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('orders');

    if (!table.status) {
      await queryInterface.addColumn('orders', 'status', {
        type: Sequelize.ENUM('draft', 'submitted', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
      });
    }

    if (!table.discount) {
      await queryInterface.addColumn('orders', 'discount', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.coupon_code) {
      await queryInterface.addColumn('orders', 'coupon_code', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('orders');

    if (table.coupon_code) {
      await queryInterface.removeColumn('orders', 'coupon_code');
    }

    if (table.discount) {
      await queryInterface.removeColumn('orders', 'discount');
    }

    if (table.status) {
      await queryInterface.removeColumn('orders', 'status');
    }


  }
};