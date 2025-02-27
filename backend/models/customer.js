module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      custname: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false
    });
  
    return Customer;
  };