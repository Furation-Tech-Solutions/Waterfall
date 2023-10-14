// Import necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define statusEnum to represent possible status values
export const statusEnum = {
  ACCEPT: "Accept",
  PENDING: "Pending",
  DECLINE: "Decline",
};

// Define jobStatusEnum to represent possible job status values
export const jobStatusEnum = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  DECLINE: "Decline",
};

// Define the "JobApplicant" model using Sequelize
const JobApplicant = sequelize.define("JobApplicant", {
  job: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: "Job", // Make sure this matches your "Jobs" model name
    //   key: "id", // Adjust this key if necessary
    // },
  },

  applicant: {
    type: DataTypes.UUID, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    // references: {
    //   model: "Realtor", // Replace with the actual name of the 'Realtor' table
    //   key: "id", // Replace with the actual primary key of the 'Realtor' table
    // },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
    validate: {
      isIn: {
        args: [Object.values(statusEnum)],
        msg: "Invalid status",
      },
    },
  },
  agreement: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  jobStatus: {
    type: DataTypes.ENUM(...Object.values(jobStatusEnum)),
    allowNull: false,
    defaultValue: "Pending",
  },
  appliedTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Export the "JobApplicant" model as the default export
export default JobApplicant;
