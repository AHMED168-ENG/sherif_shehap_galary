'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deletedLanguage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  deletedLanguage.init({
    language: DataTypes.STRING,
    shourtcut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'deletedLanguage',
  });
  return deletedLanguage;
};