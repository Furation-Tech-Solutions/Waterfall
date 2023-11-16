// Import necessary modules and dependencies
import { DataTypes } from "sequelize"; // Importing DataTypes from Sequelize library
import { sequelize } from "@main/sequelizeClient"; // Importing the Sequelize instance

import Realtors from "@data/realtors/model/realtor-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";

// Define enums for specific values
export const numberOfApplicantsEnum = {
  FROM1TO5: "1To5",
  FROM5TO10: "5To10",
  FROM10TO15: "10To15",
  FROM15TO20: "15To20",
  FROM20TO25: "20To25",
  FROM25TO30: "25To30",
};

export const jobTypeEnum = {
  SHOWINGPROPERTYtTOCLIENT: "Showing property to client",
  ONETIMEVISIT: "One time visit",
  HELPWITHOPENHOUSE: "Help with open house",
  WRITINGCMA: "Writing CMA",
  WRITINGANOFFER: "Writing an offer",
  HELPINGWITHMOREINSPECTION: "Helping with more inspection",
  OTHERS: "Others",
};

export const feeTypeEnum = {
  FIXRATE: "Fix Rate",
  FLATFEE: "Flat Fee",
};

// Define a Sequelize model named "Job"
const Job = sequelize.define("Job", {
  // Define various fields of the "Job" model with their data types and constraints

  // UUID representing the job owner
  jobOwner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },

  // Location of the job
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Address of the job
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Date of the job
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // Number of applicants for the job, with predefined values using ENUM
  numberOfApplicants: {
    type: DataTypes.ENUM(...Object.values(numberOfApplicantsEnum)),
    allowNull: false,
  },

  // Start time of the job
  fromTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // End time of the job
  toTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Type of the job, with predefined values using ENUM
  jobType: {
    type: DataTypes.ENUM(...Object.values(jobTypeEnum)),
    allowNull: false,
  },

  // Email of the client associated with the job
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Phone number of the client associated with the job
  clientPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Type of fee for the job, with predefined values using ENUM
  feeType: {
    type: DataTypes.ENUM(...Object.values(feeTypeEnum)),
    allowNull: false,
  },

  // Fee associated with the job
  fee: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Description of the job
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Attachments for the job, stored as an array of strings
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },

  // Deadline for applying to the job
  applyBy: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // Timestamp representing the creation date of the job
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },

  // Reason for deleting the job
  deleteReason: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Coordinates of the job, stored as JSONB for better performance and flexibility
  coordinates: {
    type: DataTypes.JSONB,
    allowNull: true,
  },

  // Boolean indicating the live status of the job
  liveStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  // Boolean indicating if the job has an urgent requirement
  urgentRequirement: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Define an association between Job and Realtors (jobOwner)
Job.belongsTo(Realtors, {
  foreignKey: "jobOwner",
  as: "owner", // Optional alias for the association
});

// Export the "Job" model as the default export of this module
export default Job;
