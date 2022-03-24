'use strict';
const {Model , Op} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  language.init({
    language: DataTypes.STRING,
    shourtcut: DataTypes.STRING,
    direction: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    country_img: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'language',
    scopes : {
      allLanguageActive : {
        where : {
          active : true
        }
      },
      defaultLanguage : {
        where : {
          shourtcut : defaultLanguage()
        }
      },
      getLanguageWithoutDefault : {
        where : {
          shourtcut : {
            [Op.ne] : defaultLanguage()
          }
        }
      }
    }
  });
  return language;
};