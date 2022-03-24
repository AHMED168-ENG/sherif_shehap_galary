'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName_ar: {
        type: Sequelize.STRING
      },
      productName_en: {
        type: Sequelize.STRING
      },
      ProductOverview_ar: {
        type: Sequelize.STRING
      },
      ProductOverview_en: {
        type: Sequelize.STRING
      },
      fullDescription_ar : {
        type: Sequelize.STRING
      },
      fullDescription_en : {
        type: Sequelize.STRING
      },
      typeOfWood_ar : {
        type: Sequelize.STRING
      },
      typeOfWood_en : {
        type: Sequelize.STRING
      },
      available : {
        type: Sequelize.BOOLEAN
      },
      dayeOfWork : {
        type: Sequelize.INTEGER
      },
      pieces : {
        type: Sequelize.INTEGER
      },
      pieceName_ar : {
        type: Sequelize.STRING
      },
      pieceName_en : {
        type: Sequelize.STRING
      },
      colors_ar : {
        type: Sequelize.STRING
      },
      colors_en : {
        type: Sequelize.STRING
      },
      structure : {
        type: Sequelize.INTEGER
      },
      shipping : {
        type: Sequelize.INTEGER
      },
      pay : {
        type: Sequelize.INTEGER
      },
      security : {
        type: Sequelize.INTEGER
      },
      descount: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      catigory: {
        type: Sequelize.INTEGER
      },
      productState: {
        type: Sequelize.BOOLEAN
      },
      dayesOfUsed: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.INTEGER
      },
      ProductOverview: {
        type: Sequelize.STRING
      },
      fullDescription: {
        type: Sequelize.STRING
      },
      keyWord: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      active : {
        type : Sequelize.BOOLEAN
      },
      comments : {
        type : Sequelize.BOOLEAN
      },
      likes : {
        type : Sequelize.BOOLEAN
      },
      interAction : {
        type : Sequelize.BOOLEAN
      },
      sumRate : {
        type : Sequelize.INTEGER
      },
      productImage: {
        type: Sequelize.STRING
      },
      descriptionImage: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      productVideo: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};