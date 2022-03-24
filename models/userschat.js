'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      usersChat.belongsTo(models.users , {foreignKey : "to" , as : "chatUser"})
      usersChat.belongsTo(models.users , {foreignKey : "from" , as : "FromChatUser"})
    }
  };
  usersChat.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    isSaved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'usersChat',
  });
  return usersChat;
};