'use strict';
const {Model , Op} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class catigorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      catigorys.hasMany(models.catigorys , {as : "supCatigorys" , foreignKey : "catigoryId"})
      catigorys.hasMany(models.products , {as : "catigorysProduct" , foreignKey : "catigory"})
    }
  };
  catigorys.init({
    name_ar: DataTypes.STRING,
    description_ar: DataTypes.TEXT,
    name_en: DataTypes.STRING,
    description_en: DataTypes.TEXT,
    slug: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    catigoryId: DataTypes.INTEGER,
    interAction: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'catigorys',
    scopes: {
      allCatigory : {
        where : {
          [Op.and] : [{catigoryId : {[Op.eq] : 0}}]
        }
      },
      allSupCatigory : {
        where : {
          [Op.and] : [{catigoryId : {[Op.gt] : 0}}]
        }
      },
      active : {
        where : {
          active : true
        }
      }
    }
  });
  return catigorys;
};