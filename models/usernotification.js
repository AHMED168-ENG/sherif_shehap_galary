'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userNotification.belongsTo(models.users , {foreignKey : "userId" , as : "notificationUser"})
      userNotification.belongsTo(models.users , {foreignKey : "to" , as : "notificationToUser"})
    }
  };
  userNotification.init({
    userId: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    type: DataTypes.STRING,
    isSeen: DataTypes.BOOLEAN,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'userNotification',
  });
  return userNotification;
};