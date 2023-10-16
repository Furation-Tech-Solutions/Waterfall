// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model named "SavedJob"
const SavedJob = sequelize.define("SavedJob", {
  // Define a field "Realtor" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  Realtor: {
    type: DataTypes.INTEGER,
    allowNull: false, // The field cannot be null
    references: { model: Realtors, key: 'id' }
  },

  // Define a field "Job" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  Job: {
    type: DataTypes.INTEGER,
    allowNull: false, // The field cannot be null
    references: { model: Realtors, key: 'id' }
  },
});

Realtors.hasMany(SavedJob);
// Export the "SavedJob" model as the default export
export default SavedJob;
