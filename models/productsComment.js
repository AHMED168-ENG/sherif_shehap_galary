'use strict';
const {
  Model, STRING, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      productComments.belongsTo(models.users , {as : "CommentUser" , foreignKey : "userId"}) 
    }
  };
  productComments.init({
    comment: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    likes: DataTypes.INTEGER,
    desLikes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    likesUser: DataTypes.ARRAY(DataTypes.INTEGER),
    desLikesUser: DataTypes.ARRAY(DataTypes.INTEGER),
  }, {
    sequelize,
    modelName: 'productComments',
    scopes : {
      active : {
        where : {
          active : {
            [Op.eq] : true
          }
        }
      }
    }
  });
  return productComments;
};