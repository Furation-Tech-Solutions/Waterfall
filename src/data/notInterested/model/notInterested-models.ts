// Import necessary dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import { notInterestedRouter } from "@presentation/routes/notInterested-routes";

// Define a Sequelize model named "NotInterested"
const NotInterested = sequelize.define("NotInterested", {
  // Define a field "Realtor" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  realtorId: {
    type: DataTypes.STRING, // Data type for realtor is INTEGER
    allowNull: false, // It cannot be null
    references: { model: Realtors, key: "id" }, // References the "id" column in the Realtors model
  },
  // Define a field "Job" with a data type of INTEGER (assuming it's equivalent to ObjectId in PostgreSQL)
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" }, // References the "id" column in the Job model
  },
});

// Establish associations
NotInterested.belongsTo(Job, {
  foreignKey: "jobId", // Establish a foreign key relationship with the Job model
  as: "jobIdData", // Alias for the associated Job model data
});

NotInterested.belongsTo(Realtors, {
  foreignKey: "realtorId", // Establish a foreign key relationship with the Realtors model
  as: "realtorIdData", // Alias for the associated Realtors model data
});

// Export the "NotInterested" model as the default export
export default NotInterested;
