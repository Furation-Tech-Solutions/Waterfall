
import { BelongsTo, DataTypes } from "sequelize";
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
  friends: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },
  coordinates: {
    type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
    allowNull: true, // Set to allowNull: true if coordinates are optional
  }
});

// Realtors.hasMany(Connections, { foreignKey: 'fromId', as: 'fromConnections' });
// Realtors.hasMany(Connections, { foreignKey: 'toId', as: 'toConnections' });

// Realtors.belongsToMany(Connections, { through: 'Connections', foreignKey: 'fromId', as: 'fromConnections' });
// Realtors.belongsToMany(Connections, { through: 'Connections', foreignKey: 'toId', as: 'toConnections' });
// Realtors.belongsToMany(Connections, {
//   through: 'Connections',
//   foreignKey: 'fromId',
//   otherKey: 'toId',
//   as: 'fromConnections',
//   targetKey: 'toId', // Specify the data type of the targetKey
// });




export default Realtors;
