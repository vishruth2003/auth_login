'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userEmail: {
        type: Sequelize.STRING
      },
      userPassword: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userName: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    userPhone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    roleName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    projectStatus: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};