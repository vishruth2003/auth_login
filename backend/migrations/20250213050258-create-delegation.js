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
        references: {
          model: 'Users',  
          key: 'username', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dept: Sequelize.STRING,
      custname: Sequelize.STRING,
      task: Sequelize.STRING,
      planneddate: Sequelize.DATE,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Delegations');
  },
};
