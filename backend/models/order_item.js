'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      OrderItem.belongsTo(models.Menu, { foreignKey: 'menu_id', as: 'menu' });
      OrderItem.belongsTo(models.ComboMenu, { foreignKey: 'combo_id', as: 'combo' });
    }
  }
  OrderItem.init({
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_id: { type: DataTypes.INTEGER, allowNull: true },
    combo_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    underscored: true,
    timestamps: false,
  });
  return OrderItem;
};