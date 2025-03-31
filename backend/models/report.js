module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });

    return Report;
  };