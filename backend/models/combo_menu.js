'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComboMenu extends Model {
    static associate(models) {
      ComboMenu.hasMany(models.ComboItem, { foreignKey: 'combo_id', as: 'items' });
      ComboMenu.hasMany(models.OrderItem, { foreignKey: 'combo_id', as: 'order_items' });
    }
  }
  ComboMenu.init({
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    photo_url: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'ComboMenu',
    tableName: 'combo_menus',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return ComboMenu;
};