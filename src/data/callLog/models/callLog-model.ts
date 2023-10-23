// Import Sequelize data types and the sequelize client
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

import JobApplicants from "@data/jobApplicants/models/jobApplicants-models";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";

// Define an enum for possible outcomes
export const OutcomeEnum = {
  BUSY: "Busy",
  CONNECTED: "Connected",
  LEFTLIVEMESSAGE: "LeftLiveMessage",
  LEFTVOICEMAIL: "LeftVoicemail",
  NOANSWER: "NoAnswer",
  WRONGNUMBER: "WrongNumber",
};

// Define a Sequelize model called "CallLog"
const CallLog = sequelize.define("CallLog", {
  // Define the "jobApplicant" field with a UUID data type, which cannot be null
  jobApplicant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: JobApplicants, key: 'id' }
  },
  // Define the "logActivity" field with a STRING data type, not null, and length validation
  logActivity: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg: "Log activity length must be between 1 and 500 characters",
      },
    },
  },
  // Define the "logOutcome" field with an ENUM data type based on OutcomeEnum values, not null
  logOutcome: {
    type: DataTypes.ENUM(...Object.values(OutcomeEnum)),
    allowNull: false,
  },
});

JobApplicant.hasMany(CallLog);
CallLog.belongsTo(JobApplicant, {
  foreignKey: "jobApplicant", // Use the correct attribute that links Job to Realtors
  as: "jobApplicantData", // Optionally, you can specify an alias for this association
});
// Export the CallLog model as the default export
export default CallLog;
