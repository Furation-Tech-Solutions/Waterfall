// Import necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";

// Define statusEnum to represent possible status values
export const applicationStatusEnum = {
  ACCEPT: "Accept",
  PENDING: "Pending",
  DECLINE: "Decline",
};

// Define jobStatusEnum to represent possible job status values
export const jobStatusEnum = {
  JOBCOMPLETED: "JobCompleted",
  PENDING: "Pending",
  DECLINE: "Decline",
};

// Define the "JobApplicant" model using Sequelize
const JobApplicant = sequelize.define("JobApplicant", {
  // Define the "job" field with its data type and constraints
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" }, // Reference to the Job model's id
  },
  // Define the "applicant" field with its data type and constraints
  applicantId: {
    type: DataTypes.STRING, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference to the Realtors model's id
  },
  // Define the "applicantStatus" field with its data type and constraints
  applicantStatus: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
    validate: {
      isIn: {
        args: [Object.values(applicationStatusEnum)],
        msg: "Invalid status",
      },
    },
  },

  // Define the "applicantStatusUpdateTime" field with its data type
  applicantStatusUpdateTime: {
    type: DataTypes.STRING,
  },

  // Define the "agreement" field with its data type and constraints
  agreement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Define the "jobStatus" field with its data type and constraints
  jobStatus: {
    type: DataTypes.ENUM(...Object.values(jobStatusEnum)),
    defaultValue: "Pending",
  },
  // Define the "paymentStatus" field with its data type and constraints
  paymentStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Define the "paymentStatusUpdateTime" field with its data type
  paymentStatusUpdateTime: {
    type: DataTypes.STRING,
  },
});

// Define associations between JobApplicant and other models
Job.hasMany(JobApplicant, {
  foreignKey: "jobId",
  as: "applicantsData",
});

JobApplicant.belongsTo(Job, {
  foreignKey: "jobId",
  as: "jobIdData",
});

JobApplicant.belongsTo(Realtors, {
  foreignKey: "applicantId",
  as: "applicantIdData",
});

// Export the "JobApplicant" model as the default export
export default JobApplicant;
