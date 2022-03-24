'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      usersMessage.belongsTo(models.users , {foreignKey : "to" , as : "messageToUser"})
      usersMessage.belongsTo(models.users , {foreignKey : "from" , as : "messageFromUser"})
    }
  };
  usersMessage.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isSeen: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'usersMessage',
  });
  return usersMessage;
};