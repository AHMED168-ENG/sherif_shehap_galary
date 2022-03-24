'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasOne(models.vendorData ,{ as : "userVendorData" , foreignKey : "userId"})
      users.hasMany(models.postComments ,{ as : "userPostsComment" , foreignKey : "userId"})
      users.hasMany(models.userPosts ,{ as : "UserPosts" , foreignKey : "from"})
      users.hasMany(models.userNotification , {foreignKey : "userId" , as : "userNotification"})
      users.hasMany(models.usersMessage , {as : "userToMessage" , foreignKey : "to"})
      users.hasMany(models.usersMessage , {as : "userFromMessage" , foreignKey : "from"})
    }
  };
  users.init({
    fName: DataTypes.STRING,
    lName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isVendor: DataTypes.BOOLEAN,
    number: DataTypes.INTEGER,
    addres: DataTypes.STRING,
    image: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'users',
    scopes : {
      active : {
        where : {
          active : true
        }
      }
    }
  });
  return users;
};