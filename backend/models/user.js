module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true },

    userEmail: { type: DataTypes.STRING, 
      allowNull: false, 
      unique: true },

    userPassword: { type: DataTypes.STRING, 
      allowNull: false },

    token: { type: DataTypes.STRING, 
      allowNull: true },

    userName: { 
      type: DataTypes.STRING, 
      allowNull: true,
      unique: true
    }, 

    userPhone: { type: DataTypes.STRING,
      allowNull: true },  

    roleId: { type: DataTypes.INTEGER,
      allowNull: true },  

    roleName: { type: DataTypes.STRING, 
      allowNull: true },  

    projectStatus: { type: DataTypes.STRING, 
      allowNull: true },  

    department: { type: DataTypes.STRING, 
      allowNull: true },  
  });

  return User;
};