'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, { foreignKey: 'employee_id', as: 'employee' });
    }
  }
  Expense.init({
    title: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return Expense;
};