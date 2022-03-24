'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class frindesRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  frindesRequest.init({
    to: DataTypes.INTEGER,
    from : DataTypes.ARRAY(DataTypes.INTEGER),
    date : DataTypes.ARRAY(DataTypes.DATE),
    notificationSeen : DataTypes.ARRAY(DataTypes.BOOLEAN)
  }, {
    sequelize,
    modelName: 'frindesRequest',
  });
  return frindesRequest;
};