'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class postComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      postComments.belongsTo(models.users , { as : "postCommentUser" , foreignKey : "userId"})
      postComments.belongsTo(models.userPosts ,{ as : "CommentsUserPost" , foreignKey : "postId"})
      postComments.hasMany(models.postComments ,{ as : "supComments" , foreignKey : "to"})

    }
  };
  postComments.init({
    comment: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    LikesTypes: DataTypes.ARRAY(DataTypes.STRING),
    usersLikes: DataTypes.ARRAY(DataTypes.INTEGER),
    images: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'postComments',
  });
  return postComments;
};