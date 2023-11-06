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
  job: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },

  },
  applicant: {
    type: DataTypes.INTEGER, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    references: { model: Realtors, key: "id" },

  },
  applicantStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
    validate: {
      isIn: {
        args: [Object.values(applicationStatusEnum)],
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
  paymentStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,

  }

});

Job.hasMany(JobApplicant, {
  foreignKey: "job",
  as: "applicantsData",
});
JobApplicant.belongsTo(Job, {
  foreignKey: "job",
  as: "jobData",
});

JobApplicant.belongsTo(Realtors, {
  foreignKey: "applicant",
  as: "applicantData",
})


// Export the "JobApplicant" model as the default export
export default JobApplicant;