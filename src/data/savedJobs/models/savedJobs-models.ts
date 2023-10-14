// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model named "SavedJob"
const SavedJob = sequelize.define("SavedJob", {
  // Define a field "Realtor" with a data type of UUID (assuming it's equivalent to ObjectId in PostgreSQL)
  Realtor: {
    type: DataTypes.UUID,
    allowNull: false, // The field cannot be null
  },

  // Define a field "Job" with a data type of UUID (assuming it's equivalent to ObjectId in PostgreSQL)
  Job: {
    type: DataTypes.UUID,
    allowNull: false, // The field cannot be null
  },
});

// Export the "SavedJob" model as the default export
export default SavedJob;
