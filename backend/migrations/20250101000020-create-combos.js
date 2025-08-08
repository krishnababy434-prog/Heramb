"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("combo_menus", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      photo_url: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable("combo_items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      combo_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'combo_menus', key: 'id' }, onDelete: 'CASCADE' },
      menu_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'menus', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('combo_items');
    await queryInterface.dropTable('combo_menus');
  }
};