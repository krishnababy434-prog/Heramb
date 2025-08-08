"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.ENUM('percentage','fixed'), allowNull: false, defaultValue: 'percentage' },
      value: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
      max_uses: { type: Sequelize.INTEGER, allowNull: true },
      used_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('coupons', ['code']);
    await queryInterface.addIndex('coupons', ['is_active']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupons');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coupons_type"');
  }
};