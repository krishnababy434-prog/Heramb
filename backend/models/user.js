'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'created_by', as: 'orders' });
      User.hasMany(models.Expense, { foreignKey: 'employee_id', as: 'expenses' });
    }
  }
  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mobile: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'employee'), allowNull: false, defaultValue: 'employee' },
    password_hash: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return User;
};