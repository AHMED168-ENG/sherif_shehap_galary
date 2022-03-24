'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likesPosts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  likesPosts.init({
    usersId: DataTypes.ARRAY(DataTypes.INTEGER),
    postId: DataTypes.INTEGER,
    types: DataTypes.ARRAY(DataTypes.STRING),
    createdAtLikes: DataTypes.ARRAY(DataTypes.DATE)
  }, {
    sequelize,
    modelName: 'likesPosts',
  });
  return likesPosts;
};