"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      productRating.belongsTo(models.products, {
        as: "rateProduct",
        foreignKey: "productId",
      });
    }
  }
  productRating.init(
    {
      usersId: DataTypes.ARRAY(DataTypes.INTEGER),
      productId: DataTypes.INTEGER,
      ratings: DataTypes.ARRAY(DataTypes.INTEGER),
      sumRate: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "productRating",
    }
  );
  return productRating;
};
