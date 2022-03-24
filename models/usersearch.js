'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userSearch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  userSearch.init({
    userId: DataTypes.INTEGER,
    search: DataTypes.ARRAY(DataTypes.STRING),
    catigorys: DataTypes.ARRAY(DataTypes.INTEGER),
    catigorysName: DataTypes.ARRAY(DataTypes.STRING),
    userSearchDate: DataTypes.ARRAY(DataTypes.DATE),
  }, {
    sequelize,
    modelName: 'userSearch',
  });
  return userSearch;
};