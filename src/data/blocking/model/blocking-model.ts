// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Blocking' with two integer fields: 'fromRealtor' and 'toRealtor'
const Blocking = sequelize.define('Blocking', {
  fromRealtorId: {
    type: DataTypes.STRING, // Define the data type as INTEGER
    allowNull: false, // Ensure the field is not nullable
    references: { model: Realtors, key: 'id' } // Establish a foreign key relationship with the 'Realtors' model
  },
  toRealtorId: {
    type: DataTypes.STRING, // Define the data type as INTEGER
    allowNull: false, // Ensure the field is not nullable
    references: { model: Realtors, key: 'id' } // Establish a foreign key relationship with the 'Realtors' model
  }
});

// Establish associations between the 'Blocking' model and the 'Realtors' model
Blocking.belongsTo(Realtors, {
  foreignKey: "fromRealtorId", // Define the foreign key for the 'fromRealtorData' association
  as: "fromRealtorIdData" // Alias for the association to distinguish from the actual foreign key
});

Blocking.belongsTo(Realtors, {
  foreignKey: "toRealtorId", // Define the foreign key for the 'toRealtorData' association
  as: "toRealtorIdData" // Alias for the association to distinguish from the actual foreign key
});

// Export the 'Blocking' model for use in other parts of the application
export default Blocking;
