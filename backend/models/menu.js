'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.hasMany(models.OrderItem, { foreignKey: 'menu_id', as: 'order_items' });
    }
  }
  Menu.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    photo_url: { type: DataTypes.STRING, allowNull: true },
    is_available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menus',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return Menu;
};