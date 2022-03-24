'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendorData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorImage: {
        type: Sequelize.STRING
      },
      commercFile: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      vendoerPassword: {
        type: Sequelize.STRING
      },
      vendoerEmail: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.INTEGER
      },
      vendorFname: {
        type: Sequelize.STRING
      },
      vendorLname: {
        type: Sequelize.STRING
      },
      isActive:{
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('vendorData');
  }
};