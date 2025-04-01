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
      },
      progress: {
        type: DataTypes.STRING,
        allowNull: true, // Track the progress of the report
        defaultValue: "pending",
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true, // Track the completion date of the report
      },
    });

    return Report;
  };