"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menus", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      photo_url: { type: Sequelize.STRING, allowNull: true },
      is_available: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('menus', ['created_at']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('menus');
  }
};