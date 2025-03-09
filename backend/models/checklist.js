module.exports = (sequelize, DataTypes) => {
    const Checklist = sequelize.define("Checklist", {
      id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
  
      empname: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
  
      department: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
  
      custname: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
  
      frequency: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
  
      startdate: { 
        type: DataTypes.DATE, 
        allowNull: false 
      },
  
      enddate: { 
        type: DataTypes.DATE, 
        allowNull: false 
      },
  
      taskname: { 
        type: DataTypes.STRING, 
        allowNull: false 
      }
    });
  
    return Checklist;
  };