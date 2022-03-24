'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('languages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shourtcut: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: false,
        default : "rtl"
      },
      country_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default : 0
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
    await queryInterface.dropTable('languages');
  }
};