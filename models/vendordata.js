'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vendorData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      vendorData.belongsTo(models.users ,{ as : "vendorDataUser" , foreignKey : "userId"})
      vendorData.hasMany(models.products ,{ as : "vendorProduct" , foreignKey : "userId" })
    }
  };
  vendorData.init({
    vendorImage: DataTypes.STRING,
    commercFile: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    vendoerPassword: DataTypes.STRING,
    vendoerEmail: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    vendorFname: DataTypes.STRING,
    vendorLname: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'vendorData',
    scopes : {
      active : {
        where : {
          isActive : true
        }
      }
    }
  });
  return vendorData;
};