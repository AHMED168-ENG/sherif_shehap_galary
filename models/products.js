'use strict';
const {
  Model , Op
} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      product.belongsTo(models.catigorys , {as : "productCate" , foreignKey : "catigory"})
      product.hasOne(models.productRating , {as : "productRate" , foreignKey : "productId"})
      product.belongsTo(models.vendorData ,{ as : "productVendor" , foreignKey : "userId" , targetKey : "userId"})

    }
  };
  product.init({
    productName_ar: DataTypes.STRING,
    productName_en: DataTypes.STRING,
    ProductOverview_ar: DataTypes.STRING,
    ProductOverview_en: DataTypes.STRING,
    fullDescription_ar: DataTypes.STRING,
    fullDescription_en: DataTypes.STRING,
    pieces: DataTypes.INTEGER,
    pieceName_ar : DataTypes.STRING,
    pieceName_en : DataTypes.STRING,
    typeOfWood_ar : DataTypes.STRING,
    typeOfWood_en : DataTypes.STRING,
    available : DataTypes.BOOLEAN,
    dayeOfWork : DataTypes.INTEGER,
    colors_ar: DataTypes.STRING,
    colors_en: DataTypes.STRING,
    structure : DataTypes.INTEGER,
    shipping : DataTypes.INTEGER,
    pay : DataTypes.INTEGER,
    security : DataTypes.STRING,
    catigory: DataTypes.INTEGER,
    productState: DataTypes.BOOLEAN,
    dayesOfUsed: DataTypes.INTEGER,
    version: DataTypes.INTEGER,
    productImage: DataTypes.STRING,
    descriptionImage: DataTypes.STRING,
    productVideo: DataTypes.STRING,
    keyWord: DataTypes.STRING,
    price: DataTypes.INTEGER,
    descount: DataTypes.INTEGER,
    active : DataTypes.BOOLEAN,
    comments : DataTypes.BOOLEAN,
    likes : DataTypes.BOOLEAN,
    interAction:DataTypes.BOOLEAN,
    sumRate:DataTypes.INTEGER,
    userId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
    scopes : {
      activeProducts : {
        where : {
          active : {
            [Op.eq] : true
          }
        }
      }
    }
  });
  return product;
};