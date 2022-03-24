'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userFrindes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userFrindes.init({
    userId: DataTypes.INTEGER,
    frindesId: DataTypes.ARRAY(DataTypes.INTEGER),
    RespondDirection: DataTypes.ARRAY(DataTypes.BOOLEAN),
    frindRequestTime: DataTypes.ARRAY(DataTypes.DATE),
    active: DataTypes.ARRAY(DataTypes.BOOLEAN),
  }, {
    sequelize,
    modelName: 'userFrindes',
  });
  return userFrindes;
};