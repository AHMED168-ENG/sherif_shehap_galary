'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userSearches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      search: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      catigorys: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      catigorysName: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      userSearchDate :{
        type: Sequelize.ARRAY(Sequelize.DATE)
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
    await queryInterface.dropTable('userSearches');
  }
};