'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
    }
  }
  Order.init({
    customer_name: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING, allowNull: true },
    subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    tax: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return Order;
};