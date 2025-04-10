'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Checklists', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      empname: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('empname', value.trim());
        }
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      custname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startdate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      enddate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      taskname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      remarks: { 
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      progress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastcompleteddate: {
        type: Sequelize.DATE,
        allowNull: true
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Checklists');
  }
};