import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";
import Job from "@data/job/models/job-model"
import Connections from "@data/connections/models/connections_model";

const Realtors = sequelize.define('Realtors', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  DOB: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 10]
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  countryCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      len: [0, 15]
    }
  },
  deleteStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  coordinates: {
    type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
    allowNull: true, // Set to allowNull: true if coordinates are optional
  }
});

// Connections.belongsTo(Realtors, { foreignKey: 'fromId'});
// Connections.belongsTo(Realtors, { foreignKey: 'toId'});

// Realtors.hasMany(Connections, { foreignKey: 'fromId', as: "fromID" });
// Realtors.hasMany(Connections, { foreignKey: 'toId', as: "toID" });

export default Realtors;
