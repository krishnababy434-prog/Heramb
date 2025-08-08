'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {}
  }
  Inventory.init({
    name: { type: DataTypes.STRING, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    threshold_alert: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  }, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventory',
    underscored: true,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: false,
  });
  return Inventory;
};