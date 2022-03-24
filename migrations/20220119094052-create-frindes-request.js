'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('frindesRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      to: {
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      date: {
        type: Sequelize.ARRAY(Sequelize.DATE)
      },
      notificationSeen: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN)
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
    await queryInterface.dropTable('frindesRequests');
  }
};