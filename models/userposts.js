'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userPosts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userPosts.hasOne(models.likesPosts , {as : "PostsLikes" , foreignKey : "postId"})
      userPosts.hasMany(models.postComments ,{ as : "postComments" , foreignKey : "postId"})
      userPosts.belongsTo(models.users ,{ as : "postsUser" , foreignKey : "from"})
      userPosts.belongsTo(models.users ,{ as : "postsUserTo" , foreignKey : "to"})

    }
  };
  userPosts.init({
    post: DataTypes.STRING,
    type: DataTypes.STRING,
    image: DataTypes.STRING,
    video: DataTypes.STRING,
    commentNumber: DataTypes.INTEGER,
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'userPosts',
  });
  return userPosts;
};