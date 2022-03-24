'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('likesPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usersId: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      postId: {
        type: Sequelize.INTEGER
      },
      types: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAtLikes: {
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
    await queryInterface.dropTable('likesPosts');
  }
};