'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComboItem extends Model {
    static associate(models) {
      ComboItem.belongsTo(models.ComboMenu, { foreignKey: 'combo_id', as: 'combo' });
      ComboItem.belongsTo(models.Menu, { foreignKey: 'menu_id', as: 'menu' });
    }
  }
  ComboItem.init({
    combo_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'ComboItem',
    tableName: 'combo_items',
    underscored: true,
    timestamps: false,
  });
  return ComboItem;
};