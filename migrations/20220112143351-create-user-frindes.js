'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userFrindes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      frindesId: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      RespondDirection: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        comments : "1 meen that me send request 0 meen that user send request to me"
      },
      frindRequestTime: {
        type: Sequelize.ARRAY(Sequelize.DATE)
      },
      active: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
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
    await queryInterface.dropTable('userFrindes');
  }
};