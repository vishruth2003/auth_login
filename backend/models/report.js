module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userName' 
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  
    Report.associate = (models) => {
      Report.belongsTo(models.User, {
        foreignKey: 'name',
        targetKey: 'userName'
      });
    };
  
    return Report;
  };