module.exports = (sequelize, DataTypes) => {
  const Delegation = sequelize.define("Delegation", {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    userId: {  // Foreign key referencing Users table
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",  // Table name (case-sensitive)
        key: "id",       // Primary key of Users table
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    dept: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    custName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    task: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    plannedDate: { 
      type: DataTypes.DATE, 
      allowNull: false 
    }
  });

  Delegation.associate = (models) => {
    Delegation.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Delegation;
};
