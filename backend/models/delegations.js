module.exports = (sequelize, DataTypes) => {
  const Delegation = sequelize.define("Delegation", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dept: DataTypes.STRING,
    custname: DataTypes.STRING,
    task: DataTypes.STRING,
    planneddate: DataTypes.DATE,
    progress: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  });

  return Delegation;
};