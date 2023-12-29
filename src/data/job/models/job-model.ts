// Import necessary modules and dependencies
import { DataTypes, Sequelize } from "sequelize"; // Importing DataTypes from Sequelize library
import { sequelize } from "@main/sequelizeClient"; // Importing the Sequelize instance

import Realtors from "@data/realtors/model/realtor-model";
import NotInterested from "@data/notInterested/model/notInterested-models";

// Define enums for specific values
export const numberOfApplicantsEnum = {
  FROM1TO5: "5",
  FROM5TO10: "10",
  FROM10TO15: "15",
  FROM15TO20: "20",
  FROM20TO25: "25",
  FROM25TO30: "30",
};

export const jobTypeEnum = {
  SHOWINGPROPERTYTOCLIENT: "Showing-property-to-client",
  ONETIMEVISIT: "One-time-visit",
  HELPWITHOPENHOUSE: "Help-with-open-house",
  WRITINGCMA: "Writing-CMA",
  WRITINGANOFFER: "Writing-an-offer",
  HELPINGWITHMOREINSPECTION: "Helping-with-more-inspection",
  OTHERS: "Others",
};

export const feeTypeEnum = {
  FIXRATE: "Hourly-Rate",
  FLATFEE: "Flat-Fee",
};

// Define a Sequelize model named "Job"
const Job = sequelize.define(
  "Job",
  {
    // Define various fields of the "Job" model with their data types and constraints

    // UUID representing the job owner
    jobOwnerId: {
      type: DataTypes.STRING,
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

    applyBy: {
      type: DataTypes.DATE,
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
    },

    // Attachments for the job, stored as an array of strings
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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
      defaultValue: "",
    },

    // Coordinates of the job, stored as JSONB for better performance and flexibility
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    // Boolean indicating the live status of the job
    liveStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // Boolean indicating if the job has an urgent requirement
    urgentRequirement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    jobProgress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "active",
    },
  },
  {
    // Enable soft deletes
    paranoid: true,
  }
);

// Define an association between Job and Realtors (jobOwner)
Job.belongsTo(Realtors, {
  foreignKey: "jobOwnerId",
  as: "jobOwnerData", // Optional alias for the association
});
// Export the "Job" model as the default export of this module
export default Job;
