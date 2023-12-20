// Import necessary modules and dependencies
import { strict } from "assert"; // Importing assert module (but not used in the code)
import { DataTypes } from "sequelize"; // Importing DataTypes from Sequelize
import { sequelize } from "@main/sequelizeClient"; // Importing the sequelize instance

import Realtors from "@data/realtors/model/realtor-model"; // Importing the Realtors model

// Define a Sequelize model called "Connections"
const Connections = sequelize.define("Connections", {
  // Define the "fromId" field with an INTEGER data type, which cannot be null
  fromId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Establishing a foreign key reference to the Realtors model
  },
  // Define the "toId" field with an INTEGER data type, which cannot be null
  toId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Establishing a foreign key reference to the Realtors model
  },
  // Define the "connected" field with a BOOLEAN data type and a default value of false
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Establish associations with the Realtors model using foreign keys
Connections.belongsTo(Realtors, { foreignKey: "fromId", as: "fromData" }); // Association for the "fromRealtor"
Connections.belongsTo(Realtors, { foreignKey: "toId", as: "toData" }); // Association for the "toRealtor"

// Export the Connections model as the default export
export default Connections;
