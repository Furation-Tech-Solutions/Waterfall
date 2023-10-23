// Import necessary modules and dependencies
import { DataTypes } from "sequelize"; // Importing DataTypes from Sequelize library
import sequelize from "@main/sequelizeClient"; // Importing the Sequelize instance

import Realtors from "@data/realtors/model/realtor-model";

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
  jobOwner: {
    type: DataTypes.INTEGER, // Data type for jobOwner is UUID
    allowNull: false, // It cannot be null
    references: { model: Realtors, key: "id" },
  },
  location: {
    type: DataTypes.STRING, // Data type for location is STRING
    allowNull: false, // It cannot be null
  },
  address: {
    type: DataTypes.STRING, // Data type for address is STRING
    allowNull: false, // It cannot be null
  },
  date: {
    type: DataTypes.DATE, // Data type for date is DATE
    allowNull: false, // It cannot be null
  },
  numberOfApplicants: {
    type: DataTypes.ENUM(...Object.values(numberOfApplicantsEnum)), // Data type for numberOfApplicants is ENUM with predefined values
    allowNull: false, // It cannot be null
  },
  fromTime: {
    type: DataTypes.STRING, // Data type for fromTime is STRING
    allowNull: false, // It cannot be null
  },
  toTime: {
    type: DataTypes.STRING, // Data type for toTime is STRING
    allowNull: false, // It cannot be null
  },
  jobType: {
    type: DataTypes.ENUM(...Object.values(jobTypeEnum)), // Data type for jobType is ENUM with predefined values
    allowNull: false, // It cannot be null
  },
  clientEmail: {
    type: DataTypes.STRING, // Data type for clientEmail is STRING
    allowNull: false, // It cannot be null
  },
  clientPhoneNumber: {
    type: DataTypes.STRING, // Data type for clientPhoneNumber is STRING
    allowNull: false, // It cannot be null
  },
  feeType: {
    type: DataTypes.ENUM(...Object.values(feeTypeEnum)), // Data type for feeType is ENUM with predefined values
    allowNull: false, // It cannot be null
  },
  fee: {
    type: DataTypes.STRING, // Data type for fee is STRING
    allowNull: false, // It cannot be null
  },
  description: {
    type: DataTypes.STRING, // Data type for description is STRING
    allowNull: false, // It cannot be null
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Data type for attachments is an ARRAY of STRINGS
    allowNull: true, // It can be null
  },
  applyBy: {
    type: DataTypes.DATE, // Data type for applyBy is DATE
    allowNull: false, // It cannot be null
  },
  createdAt: {
    type: DataTypes.DATE, // Data type for createdAt is DATE
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Default value is the current timestamp
    allowNull: false, // It cannot be null
  },
  deleteReason: {
    type: DataTypes.STRING, // Data type for deleteReason is STRING
    allowNull: false, // It cannot be null
  },
  coordinates: {
    type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
    allowNull: true, // Set to allowNull: true if coordinates are optional
  },

  // jobApplicants:
  //   {
  //     type: DataTypes.ARRAY(DataTypes.INTEGER), // Data type for jobOwner is UUID
  //     defaultValue:[],
  //     // references: { model: JobApplicant, key: "id" },
  //   }

});
Realtors.hasMany(Job);
Job.belongsTo(Realtors, {
  foreignKey: "jobOwner", // Use the correct attribute that links Job to Realtors
  as: "owner" // Optionally, you can specify an alias for this association
});

// // Realtors.hasMany(Blocking);
// Blocking.belongsTo(Realtors, {
//   foreignKey: "fromRealtor",
//   as: "from" // Alias for the first association
// });

// Job.belongsTo( Realtors, {
//   foreignKey: "jobOwner",
//   as: "owner",
// });
// Job.belongsTo(JobApplicant, {
//   foreignKey: "jobApplicants",
//   as: "applicants",
// });

// Export the "Job" model as the default export of this module
export default Job;
