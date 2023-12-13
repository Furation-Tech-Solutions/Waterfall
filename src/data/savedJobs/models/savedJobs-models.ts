// Import necessary dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";

// Import Sequelize models for related tables
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";

// Define a Sequelize model named "SavedJob"
const SavedJob = sequelize.define("SavedJob", {
  // Define a field "Realtor" with a data type of INTEGER
  // This field represents the foreign key linking to the "Realtors" table
  realtorId: {
    type: DataTypes.STRING,
    allowNull: false, // The field cannot be null
    references: { model: Realtors, key: "id" }, // Establish a foreign key relationship
  },

  // Define a field "Job" with a data type of INTEGER
  // This field represents the foreign key linking to the "Job" table
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false, // The field cannot be null
    references: { model: Job, key: "id" }, // Establish a foreign key relationship
  },
});

// Define associations between tables
SavedJob.belongsTo(Job, {
  foreignKey: "jobId", // Define the foreign key in the "SavedJob" table
  as: "jobIdData", // Alias for the associated data from the "Job" table
});

SavedJob.belongsTo(Realtors, {
  foreignKey: "realtorId", // Define the foreign key in the "SavedJob" table
  as: "realtorIdData", // Alias for the associated data from the "Realtors" table
});

// Export the "SavedJob" model as the default export
export default SavedJob;
