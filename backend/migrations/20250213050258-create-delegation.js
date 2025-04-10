module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Delegations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      empname: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      dept: Sequelize.STRING,
      custname: Sequelize.STRING,
      task: Sequelize.STRING,
      planneddate: Sequelize.DATE,
      startdate: { 
        type: Sequelize.DATE,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      progress: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      lastcompleteddate: {
        type: Sequelize.DATE,
        allowNull: true
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Delegations');
  },
};