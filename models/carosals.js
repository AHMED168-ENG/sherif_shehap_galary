'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carosals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      carosals.belongsTo(models.catigorys , {as : "mainCatigory" , foreignKey : "catigory"})
    }
  };
  carosals.init({
    locationInProject: DataTypes.STRING,
    header_ar: DataTypes.STRING,
    header_en: DataTypes.STRING,
    description_ar: DataTypes.STRING,
    description_en: DataTypes.STRING,
    catigory: DataTypes.INTEGER,
    images: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'carosals',
    scopes : {
      carosalActive : {
        where : {
          active : true
        }
      }
    }
  });
  return carosals;
};